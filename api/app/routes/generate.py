"""Ad copy generation endpoints."""

import logging
import time
from typing import Optional

from fastapi import APIRouter, HTTPException

from app.config_loader import get_audience_hint, get_tone_hint, get_subtype_hint
from app.models.io import GenerateRequest, GenerateResponse, GeneratedOption
from app.services.limits import get_limits_for_channel, validate_generated_fields
from app.services.llm import generate_copy_with_openai
from app.services.scrape import format_scraped_summary, scrape_landing_page

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate-copy", response_model=GenerateResponse)
async def generate_copy(request: GenerateRequest) -> GenerateResponse:
    """
    Generate ad copy for the specified channel and requirements.

    Args:
        request: GenerateRequest with channel, subtype, university, tone, audience, etc.

    Returns:
        GenerateResponse with 3 copy options, warnings, and metadata
    """
    start_time = time.time()
    timings = {}

    logger.info(f"Generating copy for {request.channel} - {request.subtype}")

    try:
        # Get field limits for this channel
        field_limits = get_limits_for_channel(request.channel, request.subtype)
        if not field_limits:
            raise HTTPException(
                status_code=400,
                detail=f"No field limits found for channel '{request.channel}' and subtype '{request.subtype}'"
            )

        # Get tone, audience, and subtype hints
        tone_hint = get_tone_hint(request.tone)
        audience_hint = get_audience_hint(request.audience)
        subtype_hint = get_subtype_hint(request.subtype)

        # Scrape landing page if URL provided
        scraped_context: Optional[str] = None
        if request.landing_url:
            scrape_start = time.time()
            logger.info(f"Scraping landing page: {request.landing_url}")

            scraped_content = await scrape_landing_page(str(request.landing_url))
            if not scraped_content.error:
                scraped_context = format_scraped_summary(scraped_content)
                logger.info(f"Scraped {scraped_content.word_count} words from landing page")
            else:
                logger.warning(f"Failed to scrape landing page: {scraped_content.error}")

            timings["scrape_ms"] = int((time.time() - scrape_start) * 1000)

        # Generate copy options
        generation_start = time.time()
        raw_options, model_used = await generate_copy_with_openai(
            channel=request.channel,
            subtype=request.subtype,
            university=request.university,
            tone=request.tone,
            audience=request.audience,
            usps=request.usps,
            fields=field_limits,
            tone_hint=tone_hint,
            audience_hint=audience_hint,
            subtype_hint=subtype_hint,
            emojis_allowed=request.emojis_allowed,
            scraped_context=scraped_context,
            num_options=1,
            creativity=request.creativity,
            open_day_date=request.open_day_date,
        )
        timings["generation_ms"] = int((time.time() - generation_start) * 1000)

        # Validate and format each option
        validated_options = []
        all_warnings = []

        for idx, raw_option in enumerate(raw_options):
            validated_fields, warnings = validate_generated_fields(raw_option, field_limits)
            all_warnings.extend(warnings)

            validated_options.append(GeneratedOption(
                option=idx + 1,
                fields=validated_fields
            ))

        timings["total_ms"] = int((time.time() - start_time) * 1000)

        logger.info(f"Generated {len(validated_options)} options in {timings['total_ms']}ms")

        return GenerateResponse(
            options=validated_options,
            warnings=all_warnings,
            source="openai",
            model_used=model_used,
            scraped_context=scraped_context,
            timings=timings,
        )

    except Exception as e:
        logger.error(f"Error generating copy: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate copy: {str(e)}")
