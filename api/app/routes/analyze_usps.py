"""Extract USPs from landing page content."""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

from app.services.scrape import scrape_landing_page, format_scraped_summary
from app.services.llm import extract_usps_from_content

logger = logging.getLogger(__name__)
router = APIRouter()


class AnalyzeUSPsRequest(BaseModel):
    """Request to analyze landing page and extract USPs."""
    url: HttpUrl


class AnalyzeUSPsResponse(BaseModel):
    """Response with extracted USPs."""
    usps: list[str]
    scraped_content: str


@router.post("/analyze-usps", response_model=AnalyzeUSPsResponse)
async def analyze_usps(request: AnalyzeUSPsRequest) -> AnalyzeUSPsResponse:
    """
    Analyze a landing page and extract 3-5 key USPs.

    Args:
        request: URL of the landing page to analyze

    Returns:
        AnalyzeUSPsResponse with extracted USPs and scraped content
    """
    logger.info(f"Analyzing USPs from: {request.url}")

    try:
        # Scrape the landing page
        scraped_content = await scrape_landing_page(str(request.url))

        if scraped_content.error:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to scrape landing page: {scraped_content.error}"
            )

        # Format the scraped content
        formatted_content = format_scraped_summary(scraped_content)

        # Extract USPs using LLM
        usps = await extract_usps_from_content(formatted_content)

        logger.info(f"Extracted {len(usps)} USPs from landing page")

        return AnalyzeUSPsResponse(
            usps=usps,
            scraped_content=formatted_content[:500]  # Return preview
        )

    except Exception as e:
        logger.error(f"Error analyzing USPs: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze landing page: {str(e)}"
        )
