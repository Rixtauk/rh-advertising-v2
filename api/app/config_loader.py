"""Configuration loader for YAML files with caching."""

import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Optional

import yaml

from app.deps import get_settings
from app.models.domain import AdLimit, AssetSpec, Taxonomies

logger = logging.getLogger(__name__)

# In-memory cache
_cache: dict[str, tuple[Any, datetime]] = {}


def _get_data_path() -> Path:
    """Get path to data directory."""
    # Try relative to project root
    root = Path(__file__).parent.parent.parent
    data_dir = root / "data"
    if data_dir.exists():
        return data_dir

    # Try relative to current working directory
    data_dir = Path.cwd() / "data"
    if data_dir.exists():
        return data_dir

    # Try in api/data directory (Railway deployment)
    # Path(__file__) is /app/api/app/config_loader.py
    # So parent.parent.parent is /app, and we want /app/api/data
    api_root = Path(__file__).parent.parent  # /app/api
    api_data_dir = api_root / "data"  # /app/api/data
    if api_data_dir.exists():
        return api_data_dir

    raise FileNotFoundError(
        f"Data directory not found. Tried: {root}/data, {Path.cwd()}/data, and {api_data_dir}"
    )


def _load_yaml(file_path: str) -> Any:
    """Load and parse YAML file with caching."""
    settings = get_settings()
    cache_key = f"yaml:{file_path}"

    # Check cache
    if cache_key in _cache:
        data, cached_at = _cache[cache_key]
        ttl = timedelta(seconds=settings.config_cache_ttl_seconds)
        if datetime.now() - cached_at < ttl:
            logger.debug(f"Cache hit for {file_path}")
            return data
        else:
            logger.debug(f"Cache expired for {file_path}")
            del _cache[cache_key]

    # Load from file
    full_path = _get_data_path() / file_path
    logger.info(f"Loading YAML from {full_path}")

    try:
        with open(full_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)

        # Cache it
        _cache[cache_key] = (data, datetime.now())
        return data

    except FileNotFoundError:
        logger.error(f"YAML file not found: {full_path}")
        raise
    except yaml.YAMLError as e:
        logger.error(f"Error parsing YAML file {full_path}: {e}")
        raise


def clear_cache() -> int:
    """Clear all cached configuration data and return number of entries cleared."""
    global _cache
    count = len(_cache)
    _cache.clear()
    logger.info(f"Configuration cache cleared: {count} entries")
    return count


def load_ad_limits() -> list[AdLimit]:
    """Load ad limits from YAML."""
    raw_data = _load_yaml("ad_limits.yaml")
    return [AdLimit(**item) for item in raw_data]


def load_asset_specs() -> list[AssetSpec]:
    """Load asset specs from YAML."""
    raw_data = _load_yaml("asset_specs.yaml")
    return [AssetSpec(**item) for item in raw_data]


def load_taxonomies() -> Taxonomies:
    """Load taxonomies from YAML."""
    raw_data = _load_yaml("taxonomies.yaml")
    return Taxonomies(**raw_data)


def get_ad_limits_for_channel(channel: str, subtype: Optional[str] = None) -> Optional[AdLimit]:
    """Get ad limits for a specific channel and optional subtype."""
    limits = load_ad_limits()

    # Try exact match first
    for limit in limits:
        if limit.channel == channel and limit.subtype == subtype:
            return limit

    # Fall back to channel without subtype
    for limit in limits:
        if limit.channel == channel and limit.subtype is None:
            return limit

    return None


def get_asset_specs_for_channel(channel: str) -> list[AssetSpec]:
    """Get asset specs for a specific channel."""
    specs = load_asset_specs()
    return [spec for spec in specs if spec.channel == channel]


def is_emoji_allowed_for_channel(channel: str) -> bool:
    """Check if emojis are allowed for a channel."""
    taxonomies = load_taxonomies()
    return channel in taxonomies.social_channels


def get_tone_hint(tone: str) -> str:
    """Get style hint for a tone of voice from taxonomies."""
    taxonomies = load_taxonomies()
    hints = taxonomies.tone_hints if hasattr(taxonomies, 'tone_hints') else {}
    return hints.get(tone, "Clear and engaging.")


def get_audience_hint(audience: str) -> str:
    """Get style hint for target audience from taxonomies."""
    taxonomies = load_taxonomies()
    hints = taxonomies.audience_hints if hasattr(taxonomies, 'audience_hints') else {}
    return hints.get(audience, "Tailor to their needs and aspirations.")
