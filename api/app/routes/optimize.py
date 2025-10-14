"""Landing page optimization endpoints."""

import logging
import time
from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.models.io import OptimizeRequest, OptimizeResponse
from app.services.analyse import calculate_overall_score
from app.services.scrape import scrape_landing_page

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/optimize-landing", response_model=OptimizeResponse)
async def optimize_landing_page(request: OptimizeRequest) -> OptimizeResponse:
    """
    Analyze and optimize a landing page for education marketing.

    Scores the page across 6 categories:
    - Copy Quality (20pts)
    - UX/Layout (20pts)
    - Conversion Elements (20pts)
    - Technical SEO (15pts)
    - Education-Specific (15pts)
    - Accessibility (10pts)

    Args:
        request: OptimizeRequest with URL and objective

    Returns:
        OptimizeResponse with overall score, category scores, issues, and recommendations
    """
    start_time = datetime.now()
    logger.info(f"Analyzing landing page: {request.url} (objective: {request.objective})")

    try:
        # Scrape the landing page
        scrape_start = time.time()
        content = await scrape_landing_page(str(request.url), use_jina=True)

        if content.error:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to scrape landing page: {content.error}"
            )

        scrape_time = int((time.time() - scrape_start) * 1000)
        logger.info(f"Scraped {content.word_count} words in {scrape_time}ms")

        # Analyze and score the page
        analysis_start = datetime.now()
        response = calculate_overall_score(
            content=content,
            objective=request.objective,
            analysis_start_time=analysis_start
        )

        # Update URL in response (was placeholder)
        response.url = str(request.url)

        logger.info(f"Analysis complete: {response.overall_score}/100 ({response.grade}) in {response.analysis_time_ms}ms")

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing landing page: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to analyze landing page: {str(e)}")
