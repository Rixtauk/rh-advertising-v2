"""Text shortening endpoints."""

import logging

from fastapi import APIRouter, HTTPException

from app.models.io import ShortenRequest, ShortenResponse
from app.services.shorten import shorten_copy

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/shorten", response_model=ShortenResponse)
async def shorten_text(request: ShortenRequest) -> ShortenResponse:
    """
    Shorten text to fit within character limit while preserving meaning.

    Uses LLM to intelligently reduce text length while maintaining:
    - Core message and value proposition
    - Tone and voice
    - Call-to-action (if requested)
    - Impact and persuasiveness

    Args:
        request: ShortenRequest with text, max_chars, and preferences

    Returns:
        ShortenResponse with original and shortened versions
    """
    logger.info(f"Shortening text from {len(request.text)} to {request.max_chars} chars")

    try:
        original_length = len(request.text)

        if original_length <= request.max_chars:
            logger.info("Text already within limit, returning unchanged")
            return ShortenResponse(
                original=request.text,
                shortened=request.text,
                original_length=original_length,
                shortened_length=original_length,
                method="none"
            )

        # Shorten the text
        shortened = await shorten_copy(
            text=request.text,
            max_chars=request.max_chars,
            keep_cta=request.keep_cta,
            remove_emojis=request.remove_emojis,
        )

        shortened_length = len(shortened)

        logger.info(f"Shortened from {original_length} to {shortened_length} chars ({shortened_length / original_length * 100:.1f}%)")

        return ShortenResponse(
            original=request.text,
            shortened=shortened,
            original_length=original_length,
            shortened_length=shortened_length,
            method="llm"
        )

    except Exception as e:
        logger.error(f"Error shortening text: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to shorten text: {str(e)}")
