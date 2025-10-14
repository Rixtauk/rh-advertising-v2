"""Asset specification endpoints."""

import logging

from fastapi import APIRouter, HTTPException, Query

from app.config_loader import load_asset_specs
from app.models.io import SpecsResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/asset-specs", response_model=SpecsResponse)
async def get_asset_specs(
    channel: str = Query(..., description="Channel name (e.g., Meta, TikTok, YouTube)")
) -> SpecsResponse:
    """
    Get creative asset specifications for a channel.

    Returns dimensions, file types, size limits, and other requirements
    for images and videos for the specified advertising channel.

    Args:
        channel: Channel name

    Returns:
        SpecsResponse with list of specifications
    """
    logger.info(f"Fetching asset specs for channel: {channel}")

    try:
        all_specs = load_asset_specs()

        # Filter specs for the requested channel (case-insensitive)
        channel_lower = channel.lower()
        filtered_specs = [
            spec
            for spec in all_specs
            if spec.channel.lower() == channel_lower
        ]

        if not filtered_specs:
            raise HTTPException(
                status_code=404,
                detail=f"No asset specifications found for channel '{channel}'"
            )

        # Convert to dict format for response
        specs_dicts = [spec.model_dump() for spec in filtered_specs]

        logger.info(f"Found {len(filtered_specs)} specs for {channel}")

        return SpecsResponse(
            channel=channel,
            specs=specs_dicts
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching asset specs: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch asset specs: {str(e)}")
