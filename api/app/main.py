"""Main FastAPI application."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.deps import get_settings
from app.routes import generate, shorten, optimize, specs, limits, health, config, analyze_usps, debug

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    settings = get_settings()
    logger.info(f"Starting RH Edu Ads API v{app.version}")
    logger.info(f"Using model: {settings.model_generation}")
    logger.info(f"CORS origins: {settings.cors_origins_list}")
    yield
    logger.info("Shutting down RH Edu Ads API")


# Create FastAPI app
app = FastAPI(
    title="RH Education Ads API",
    description="FastAPI backend for ad copy generation and landing page optimization",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(generate.router, prefix="/v1", tags=["generation"])
app.include_router(shorten.router, prefix="/v1", tags=["generation"])
app.include_router(analyze_usps.router, prefix="/v1", tags=["generation"])
app.include_router(optimize.router, prefix="/v1", tags=["optimization"])
app.include_router(specs.router, prefix="/v1", tags=["config"])
app.include_router(limits.router, prefix="/v1", tags=["config"])
app.include_router(config.router, prefix="/admin", tags=["admin"])
app.include_router(debug.router, tags=["debug"])


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "RH Education Ads API",
        "version": "0.1.0",
        "endpoints": {
            "health": "/health",
            "generate": "POST /v1/generate-copy",
            "analyze_usps": "POST /v1/analyze-usps",
            "shorten": "POST /v1/shorten",
            "optimize": "POST /v1/optimize-landing",
            "specs": "GET /v1/asset-specs",
            "limits": "GET /v1/ad-limits",
            "reload": "POST /admin/reload-config",
            "debug_filesystem": "GET /debug/filesystem",
            "debug_env": "GET /debug/env",
            "debug_config": "GET /debug/config-loader",
        },
        "docs": "/docs",
    }
