"""Debug endpoints for troubleshooting deployment issues."""

import os
from pathlib import Path

from fastapi import APIRouter

router = APIRouter(prefix="/debug", tags=["debug"])


@router.get("/filesystem")
def debug_filesystem():
    """
    Debug endpoint to check filesystem structure in Railway.

    This endpoint reveals:
    - Actual location of Python files
    - Current working directory
    - Whether expected directories exist
    - Contents of key directories

    Use this to diagnose data directory issues.
    """
    file_location = Path(__file__).resolve()

    result = {
        "python_file_locations": {
            "__file__": str(Path(__file__)),
            "__file___resolved": str(file_location),
            "parent": str(file_location.parent),
            "parent.parent": str(file_location.parent.parent),
            "parent.parent.parent": str(file_location.parent.parent.parent),
        },
        "working_directory": {
            "cwd": str(Path.cwd()),
        },
        "directory_checks": {
            "/": Path("/").exists(),
            "/app": Path("/app").exists(),
            "/app/api": Path("/app/api").exists(),
            "/app/data": Path("/app/data").exists(),
            "/app/api/data": Path("/app/api/data").exists(),
            "cwd/data": (Path.cwd() / "data").exists(),
        },
        "directory_listings": {},
    }

    # Try to list key directories
    try:
        result["directory_listings"]["/"] = os.listdir("/")[:20]  # First 20 items
    except Exception as e:
        result["directory_listings"]["/"] = f"Error: {str(e)}"

    try:
        if Path("/app").exists():
            result["directory_listings"]["/app"] = os.listdir("/app")
    except Exception as e:
        result["directory_listings"]["/app"] = f"Error: {str(e)}"

    try:
        if Path("/app/api").exists():
            result["directory_listings"]["/app/api"] = os.listdir("/app/api")
    except Exception as e:
        result["directory_listings"]["/app/api"] = f"Error: {str(e)}"

    try:
        if Path("/app/data").exists():
            result["directory_listings"]["/app/data"] = os.listdir("/app/data")
    except Exception as e:
        result["directory_listings"]["/app/data"] = f"Error: {str(e)}"

    try:
        if Path("/app/api/data").exists():
            result["directory_listings"]["/app/api/data"] = os.listdir("/app/api/data")
    except Exception as e:
        result["directory_listings"]["/app/api/data"] = f"Error: {str(e)}"

    try:
        cwd_data = Path.cwd() / "data"
        if cwd_data.exists():
            result["directory_listings"]["cwd/data"] = os.listdir(cwd_data)
    except Exception as e:
        result["directory_listings"]["cwd/data"] = f"Error: {str(e)}"

    return result


@router.get("/env")
def debug_env():
    """
    Debug endpoint to check environment variables.

    Returns non-sensitive environment variables that affect the application.
    Excludes API keys and secrets.
    """
    safe_env_vars = [
        "LOG_LEVEL",
        "MODEL_GENERATION",
        "MODEL_GENERATION_MINI",
        "REQUEST_TIMEOUT_SECONDS",
        "CONFIG_CACHE_TTL_SECONDS",
        "CORS_ALLOW_ORIGINS",
        "PORT",
        "RAILWAY_ENVIRONMENT",
        "RAILWAY_SERVICE_NAME",
        "RAILWAY_GIT_COMMIT_SHA",
        "RAILWAY_GIT_BRANCH",
    ]

    env_data = {}
    for var in safe_env_vars:
        env_data[var] = os.getenv(var, "not set")

    # Add check for API keys (without revealing them)
    env_data["OPENAI_API_KEY_set"] = "OPENAI_API_KEY" in os.environ
    env_data["FIRECRAWL_API_KEY_set"] = "FIRECRAWL_API_KEY" in os.environ

    return env_data


@router.get("/config-loader")
def debug_config_loader():
    """
    Debug endpoint to test config_loader path detection.

    Attempts to call _get_data_path() and shows what paths it tries.
    """
    from app.config_loader import _get_data_path

    try:
        data_path = _get_data_path()
        return {
            "success": True,
            "data_path": str(data_path),
            "data_path_exists": data_path.exists(),
            "data_path_is_dir": data_path.is_dir(),
            "data_path_contents": os.listdir(data_path) if data_path.exists() else None,
        }
    except FileNotFoundError as e:
        return {
            "success": False,
            "error": str(e),
            "error_type": "FileNotFoundError",
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__,
        }
