"""Health check endpoints."""

import logging

from fastapi import APIRouter

from app.deps import get_settings
from app.models.io import HealthResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.

    Returns service status and configuration info.
    """
    settings = get_settings()

    return HealthResponse(
        status="ok",
        model=settings.model_generation,
        version="0.1.0"
    )
