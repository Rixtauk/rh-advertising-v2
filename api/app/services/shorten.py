"""Text shortening service for over-limit ad copy."""

import logging

from app.services.llm import shorten_text_with_llm

logger = logging.getLogger(__name__)


async def shorten_copy(
    text: str,
    max_chars: int,
    keep_cta: bool = True,
    remove_emojis: bool = False,
) -> str:
    """
    Shorten ad copy to fit within character limit.

    Uses LLM-based shortening to preserve meaning and impact.

    Args:
        text: Text to shorten
        max_chars: Maximum character count
        keep_cta: Whether to preserve CTA phrases
        remove_emojis: Whether to strip emojis

    Returns:
        Shortened text within character limit
    """
    if len(text) <= max_chars:
        logger.info(f"Text already within limit ({len(text)}/{max_chars} chars)")
        return text

    logger.info(f"Shortening text from {len(text)} to {max_chars} chars")

    shortened = await shorten_text_with_llm(
        text=text,
        max_chars=max_chars,
        keep_cta=keep_cta,
        remove_emojis=remove_emojis,
    )

    return shortened
