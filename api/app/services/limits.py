"""Character limit resolution and validation utilities."""

import logging
from typing import Optional, Union

from app.config_loader import get_ad_limits_for_channel
from app.models.domain import FieldLimit
from app.models.io import GeneratedField, Warning

logger = logging.getLogger(__name__)


def validate_generated_fields(
    generated_data: dict[str, Union[str, list[str]]],
    field_limits: list[FieldLimit],
) -> tuple[list[GeneratedField], list[Warning]]:
    """
    Validate generated copy fields against character limits.

    Args:
        generated_data: Dictionary of field_name -> value (string or list of strings)
        field_limits: List of FieldLimit configurations

    Returns:
        Tuple of (list of GeneratedField, list of Warning)
    """
    validated_fields = []
    warnings = []

    # Create lookup for field limits
    field_limit_map = {
        field.field.lower().replace(" ", "_"): field
        for field in field_limits
    }

    for field_name, value in generated_data.items():
        field_limit = field_limit_map.get(field_name)
        if not field_limit:
            logger.warning(f"No field limit found for '{field_name}', skipping validation")
            continue

        max_chars = field_limit.max_chars

        # Handle array fields
        if isinstance(value, list):
            char_counts = [len(item) for item in value]
            max_char_count = max(char_counts) if char_counts else 0
            is_over_limit = any(count > max_chars for count in char_counts)

            # Create shortened versions if needed
            shortened = None
            if is_over_limit:
                # For now, mark as needing shortening (will implement later)
                shortened = [
                    item[:max_chars] + "..." if len(item) > max_chars else item
                    for item in value
                ]

                warnings.append(Warning(
                    field=field_limit.field,
                    original_length=max_char_count,
                    max_length=max_chars,
                    message=f"One or more {field_limit.field} items exceed {max_chars} characters"
                ))

            validated_fields.append(GeneratedField(
                field=field_limit.field,
                value=value,
                char_count=max_char_count,
                max_chars=max_chars,
                is_over_limit=is_over_limit,
                shortened=shortened if is_over_limit else None,
                is_dropdown=field_limit.is_dropdown,
                dropdown_options=field_limit.dropdown_options
            ))

        # Handle string fields
        else:
            char_count = len(value)
            is_over_limit = char_count > max_chars

            shortened = None
            if is_over_limit:
                # Simple truncation for now
                shortened = value[:max_chars] + "..."

                warnings.append(Warning(
                    field=field_limit.field,
                    original_length=char_count,
                    max_length=max_chars,
                    message=f"{field_limit.field} exceeds {max_chars} characters by {char_count - max_chars}"
                ))

            validated_fields.append(GeneratedField(
                field=field_limit.field,
                value=value,
                char_count=char_count,
                max_chars=max_chars,
                is_over_limit=is_over_limit,
                shortened=shortened if is_over_limit else None,
                is_dropdown=field_limit.is_dropdown,
                dropdown_options=field_limit.dropdown_options
            ))

    return validated_fields, warnings


def get_limits_for_channel(channel: str, subtype: Optional[str] = None) -> list[FieldLimit]:
    """
    Get field limits for a channel and optional subtype.

    Args:
        channel: Channel name (e.g., "Meta")
        subtype: Optional subtype (e.g., "Single Image")

    Returns:
        List of FieldLimit objects
    """
    limits = get_ad_limits_for_channel(channel, subtype)
    if not limits:
        logger.warning(f"No limits found for channel '{channel}' subtype '{subtype}'")
        return []

    return limits.fields
