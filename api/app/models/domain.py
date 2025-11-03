"""Domain models for configuration entities."""

from typing import Optional
from pydantic import BaseModel, Field


class FieldLimit(BaseModel):
    """Character limit configuration for a single field."""

    field: str
    max_chars: int
    max_words: int = 0
    emojis_allowed: bool
    count: Optional[int] = None
    notes: Optional[str] = None
    is_dropdown: bool = False
    dropdown_options: Optional[list[str]] = None


class AdLimit(BaseModel):
    """Ad copy limits for a specific channel and subtype."""

    channel: str
    subtype: Optional[str] = None
    fields: list[FieldLimit]


class AssetSpec(BaseModel):
    """Creative asset specifications for a channel."""

    channel: str
    placement_or_format: str
    aspect_ratio: Optional[str] = None
    recommended_px: Optional[str] = None
    duration_seconds_max: int = 0
    file_types: list[str] = Field(default_factory=list)
    max_file_size_mb: int = 0
    caption_limit_chars: int = 0
    notes: Optional[str] = None


class Taxonomies(BaseModel):
    """Available options for channels, tones, audiences, subtypes."""

    social_channels: list[str]
    non_emoji_channels: list[str]
    all_channels: list[str]
    tones: list[str]
    audiences: list[str]
    subtypes: list[str]
    tone_hints: Optional[dict[str, str]] = {}
    audience_hints: Optional[dict[str, str]] = {}
