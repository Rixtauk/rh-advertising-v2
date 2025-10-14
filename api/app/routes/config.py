"""Configuration management endpoints."""

import logging

from fastapi import APIRouter

from app.config_loader import clear_cache
from app.models.io import ReloadResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/reload-config", response_model=ReloadResponse)
async def reload_config() -> ReloadResponse:
    """
    Clear configuration cache to force reload of YAML files.

    Use this after updating ad_limits.yaml, asset_specs.yaml, or taxonomies.yaml
    to immediately reflect changes without restarting the service.

    Returns:
        ReloadResponse with success status and number of cleared entries
    """
    logger.info("Clearing configuration cache")

    try:
        cleared_count = clear_cache()

        logger.info(f"Configuration cache cleared: {cleared_count} entries")

        return ReloadResponse(
            success=True,
            message=f"Configuration cache cleared successfully. {cleared_count} entries removed.",
            cleared_entries=cleared_count
        )

    except Exception as e:
        logger.error(f"Error clearing cache: {e}", exc_info=True)
        return ReloadResponse(
            success=False,
            message=f"Failed to clear cache: {str(e)}",
            cleared_entries=0
        )
