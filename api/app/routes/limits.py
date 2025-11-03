"""Ad limits endpoints."""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.config_loader import get_ad_limits_for_channel
from app.models.io import LimitsResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/ad-limits", response_model=LimitsResponse)
async def get_ad_limits(
    channel: str = Query(..., description="Channel name (e.g., Meta, Google Search)"),
    subtype: Optional[str] = Query(None, description="Optional subtype (e.g., Single Image, Video)")
) -> LimitsResponse:
    """
    Get ad copy character limits for a channel and optional subtype.

    Returns field names, character limits, and emoji allowances for
    the specified channel and subtype combination.

    Args:
        channel: Channel name
        subtype: Optional subtype for more specific limits

    Returns:
        LimitsResponse with field limits
    """
    logger.info(f"Fetching ad limits for channel: {channel}, subtype: {subtype}")

    try:
        limits = get_ad_limits_for_channel(channel, subtype)

        if not limits:
            raise HTTPException(
                status_code=404,
                detail=f"No ad limits found for channel '{channel}'" + (f" and subtype '{subtype}'" if subtype else "")
            )

        # Convert fields to dict format
        # Note: exclude_defaults=False ensures is_dropdown and dropdown_options are always included
        fields_dicts = [field.model_dump(mode='json', exclude_defaults=False) for field in limits.fields]

        logger.info(f"Found {len(fields_dicts)} fields for {channel}/{subtype}")

        return LimitsResponse(
            channel=limits.channel,
            subtype=limits.subtype,
            fields=fields_dicts
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching ad limits: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch ad limits: {str(e)}")
