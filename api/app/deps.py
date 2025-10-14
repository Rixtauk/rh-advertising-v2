"""Dependencies and configuration for FastAPI application."""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # OpenAI
    openai_api_key: str
    model_generation: str = "gpt-4o"
    model_generation_mini: str = "gpt-4o-mini"
    request_timeout_seconds: int = 20

    # CORS
    cors_allow_origins: str = "http://localhost:3000"

    # Jina.AI
    jina_api_key: str = ""

    # Scraping
    scrape_timeout_seconds: int = 6
    user_agent: str = "RH-Edu-Ads-Bot/1.0"

    # Logging
    log_sqlite_url: str = ""
    log_level: str = "INFO"

    # Cache
    config_cache_ttl_seconds: int = 600

    # Debug
    debug: bool = False

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_allow_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
