"""Request and response models for API endpoints."""

from datetime import datetime
from typing import Any, Literal, Optional, Union
from pydantic import BaseModel, Field, HttpUrl


# ============================================================================
# Copy Generation Models
# ============================================================================


class GenerateRequest(BaseModel):
    """Request to generate ad copy."""

    channel: str = Field(..., description="Advertising channel")
    subtype: str = Field(..., description="Type of communication")
    university: str = Field(..., description="University name")
    tone: str = Field(..., description="Tone of voice")
    audience: str = Field(..., description="Target audience")
    usps: str = Field(..., description="USPs and key points")
    emojis_allowed: bool = Field(False, description="Whether emojis are allowed")
    landing_url: Optional[HttpUrl] = Field(None, description="Landing page URL to scrape")
    creativity: int = Field(5, description="Creativity level (3=conservative, 5=balanced, 7=creative)")
    open_day_date: Optional[str] = Field(None, description="Optional open day date for contextual copy")


class GeneratedField(BaseModel):
    """A single generated field with character count validation."""

    field: str
    value: Union[str, list[str]]
    char_count: int
    max_chars: int
    is_over_limit: bool
    shortened: Optional[Union[str, list[str]]] = None
    is_dropdown: bool = False
    dropdown_options: Optional[list[str]] = None


class GeneratedOption(BaseModel):
    """A single ad copy option with all required fields."""

    option: int
    fields: list[GeneratedField]


class Warning(BaseModel):
    """Warning about over-limit fields."""

    field: str
    original_length: int
    max_length: int
    message: str


class GenerateResponse(BaseModel):
    """Response with generated ad copy options."""

    options: list[GeneratedOption]
    warnings: list[Warning] = Field(default_factory=list)
    source: str = Field("openai", description="Generation source")
    model_used: str
    scraped_context: Optional[str] = None
    timings: dict[str, float] = Field(default_factory=dict)


# ============================================================================
# Shorten Models
# ============================================================================


class ShortenRequest(BaseModel):
    """Request to shorten text to fit character limit."""

    text: str = Field(..., description="Text to shorten")
    max_chars: int = Field(..., description="Maximum character count", gt=0)
    keep_cta: bool = Field(True, description="Preserve CTA if present")
    remove_emojis: bool = Field(False, description="Remove emojis from output")


class ShortenResponse(BaseModel):
    """Response with shortened text."""

    original: str
    shortened: str
    original_length: int
    shortened_length: int
    method: str = Field("llm", description="Shortening method used")


# ============================================================================
# Landing Page Optimization Models
# ============================================================================


ObjectiveType = Literal[
    "Open Day Registration",
    "Pre-Clearing Enquiry Form",
    "Drive Applications",
    "Course Information",
]


class OptimizeRequest(BaseModel):
    """Request to analyze and optimize a landing page."""

    url: HttpUrl = Field(..., description="Landing page URL")
    objective: ObjectiveType = Field(..., description="Page objective")


class CategoryScore(BaseModel):
    """Score for a specific category."""

    score: int
    max: int
    grade: str = Field(..., description="Letter grade A-F")
    percentage: int = Field(..., description="Score as percentage")


class Issue(BaseModel):
    """A specific issue found during analysis."""

    category: str
    severity: Literal["high", "medium", "low"]
    title: str
    description: str
    evidence: Optional[str] = None
    suggestion: str
    impact: Optional[str] = None


class PageSummary(BaseModel):
    """Summary of page content."""

    title: Optional[str] = None
    h1: Optional[str] = None
    meta_description: Optional[str] = None
    cta_count: int = 0
    form_count: int = 0
    has_testimonials: bool = False
    has_rankings: bool = False
    word_count: int = 0


class OptimizeResponse(BaseModel):
    """Response with landing page analysis and suggestions."""

    overall_score: int = Field(..., ge=0, le=100)
    grade: str = Field(..., description="Overall letter grade")
    objective: ObjectiveType
    url: str
    scores: dict[str, CategoryScore]
    issues: list[Issue]
    quick_wins: list[str]
    summary: PageSummary
    scraped_at: datetime
    analysis_time_ms: int


# ============================================================================
# Config Models
# ============================================================================


class LimitsResponse(BaseModel):
    """Response with ad limits for a channel."""

    channel: str
    subtype: Optional[str]
    fields: list[dict[str, Any]]


class SpecsResponse(BaseModel):
    """Response with asset specs for a channel."""

    channel: str
    specs: list[dict[str, Any]]


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = "ok"
    model: str
    version: str = "0.1.0"


class ReloadResponse(BaseModel):
    """Config reload response."""

    success: bool
    message: str
    cleared_entries: int = 0
