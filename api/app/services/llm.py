"""OpenAI LLM service with structured outputs for ad copy generation."""

import json
import logging
from typing import Any, Optional

from openai import AsyncOpenAI
from openai.types.chat import ChatCompletion

from app.deps import get_settings
from app.models.domain import FieldLimit

logger = logging.getLogger(__name__)


def creativity_to_temperature(creativity: int) -> float:
    """
    Map creativity level to OpenAI temperature.

    Args:
        creativity: Level from 3-7 (3=conservative, 5=balanced, 7=creative)

    Returns:
        Temperature value between 0.4-0.7
    """
    mapping = {
        3: 0.4,  # Conservative - maximum constraint adherence
        5: 0.5,  # Balanced - recommended default
        7: 0.7,  # Creative - more variety, may bend constraints
    }
    return mapping.get(creativity, 0.5)  # Default to balanced if invalid value


def build_json_schema_for_channel(channel: str, fields: list[FieldLimit]) -> dict[str, Any]:
    """
    Build OpenAI JSON schema for structured output based on channel fields.

    For fields with count > 1, creates an array. Otherwise creates a string field.
    Skips fields marked as dropdown (is_dropdown=True) since they are not generated.
    """
    properties = {}
    required = []

    for field_limit in fields:
        # Skip dropdown fields - they are selected from options, not generated
        if getattr(field_limit, 'is_dropdown', False):
            continue

        field_name = field_limit.field.lower().replace(" ", "_")
        required.append(field_name)

        if field_limit.count and field_limit.count > 1:
            # Array field
            properties[field_name] = {
                "type": "array",
                "description": f"{field_limit.field} (max {field_limit.max_chars} chars each)",
                "items": {"type": "string"},
                "minItems": field_limit.count,
                "maxItems": field_limit.count,
            }
        else:
            # String field
            properties[field_name] = {
                "type": "string",
                "description": f"{field_limit.field} (max {field_limit.max_chars} chars)",
            }

    schema = {
        "type": "object",
        "properties": properties,
        "required": required,
        "additionalProperties": False,
    }

    return schema


def build_system_prompt(
    channel: str,
    subtype: str,
    tone: str,
    audience: str,
    tone_hint: str,
    audience_hint: str,
    subtype_hint: str = "",
) -> str:
    """Build system prompt for ad copy generation."""
    # Add channel-specific rules
    channel_rules = ""
    if channel.upper() in ["SEARCH", "PERFORMANCE MAX"]:
        channel_rules = "\n5. NEVER use exclamation marks (!) in any field for Google Search and Performance Max ads"

    # Add subtype context if available
    subtype_context = ""
    if subtype_hint:
        subtype_context = f"\n\nCommunication Type Context: {subtype}\n{subtype_hint}\n"

    return f"""You are an expert higher education advertising copywriter specializing in {channel} ads.

Your task is to write compelling ad copy for a {subtype} targeting {audience}.

Tone: {tone}
{tone_hint}

Audience: {audience}
{audience_hint}{subtype_context}

Guidelines:
- Write clear, benefit-focused copy that drives action
- Use active voice and strong verbs
- Focus on outcomes and transformation, not just features
- Make every character count - be concise and impactful
- Match the tone and speak directly to the target audience
- For higher education, emphasize career outcomes, experience, and opportunity

CRITICAL REQUIREMENTS (YOU MUST FOLLOW THESE):
1. Every field MUST stay within its character limit - no exceptions
2. Count characters carefully for each field before finalizing
3. Never omit required fields
4. Follow emoji rules strictly (only include where explicitly allowed){channel_rules}

You will receive specific character limits for each field.

Before submitting your response, verify that each field meets its character limit."""


def build_user_prompt(
    university: str,
    usps: str,
    fields: list[FieldLimit],
    scraped_context: Optional[str],
    emojis_allowed: bool,
    open_day_date: Optional[str] = None,
) -> str:
    """Build user prompt with university details and requirements.

    Skips dropdown fields since they are selected from options, not generated.
    """
    field_descriptions = []
    for field_limit in fields:
        # Skip dropdown fields - they are selected from options, not generated
        if getattr(field_limit, 'is_dropdown', False):
            continue

        count_str = f" (provide {field_limit.count} variations)" if field_limit.count and field_limit.count > 1 else ""
        emoji_note = " (emojis allowed)" if emojis_allowed and field_limit.emojis_allowed else " (no emojis)"
        field_descriptions.append(
            f"- {field_limit.field}: MUST be ≤{field_limit.max_chars} characters (aim for {int(field_limit.max_chars * 0.9)}-{field_limit.max_chars}){count_str}{emoji_note}"
        )

    fields_text = "\n".join(field_descriptions)

    context_section = ""
    if scraped_context:
        context_section = f"\n\nLanding Page Context:\n{scraped_context}\n"

    open_day_section = ""
    if open_day_date:
        open_day_section = f"\n\nOpen Day Date: {open_day_date}\nNote: Include this date in the copy where appropriate to create urgency and specificity.\n"

    prompt = f"""University: {university}

Key selling points and details:
{usps}
{context_section}{open_day_section}
Required fields and limits:
{fields_text}

Generate compelling ad copy that fits these exact requirements.

CRITICAL: Count characters for EACH field. If any field exceeds its limit, revise it to fit."""

    return prompt


async def generate_copy_with_openai(
    channel: str,
    subtype: str,
    university: str,
    tone: str,
    audience: str,
    usps: str,
    fields: list[FieldLimit],
    tone_hint: str,
    audience_hint: str,
    subtype_hint: str = "",
    emojis_allowed: bool = False,
    creativity: int = 5,
    scraped_context: Optional[str] = None,
    num_options: int = 3,
    open_day_date: Optional[str] = None,
) -> tuple[list[dict[str, Any]], str]:
    """
    Generate ad copy using OpenAI with structured outputs.

    Returns:
        Tuple of (list of generated options, model_used)
    """
    settings = get_settings()
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    # Build JSON schema for this channel's fields
    json_schema = build_json_schema_for_channel(channel, fields)

    # Build prompts
    system_prompt = build_system_prompt(
        channel=channel,
        subtype=subtype,
        tone=tone,
        audience=audience,
        tone_hint=tone_hint,
        audience_hint=audience_hint,
        subtype_hint=subtype_hint,
    )

    user_prompt = build_user_prompt(
        university=university,
        usps=usps,
        fields=fields,
        scraped_context=scraped_context,
        emojis_allowed=emojis_allowed,
        open_day_date=open_day_date,
    )

    logger.info(f"Generating {num_options} ad copy options for {channel} ({subtype})")

    all_options = []

    # Generate multiple options with retries
    for option_num in range(num_options):
        max_retries = 2
        for attempt in range(max_retries):
            try:
                response: ChatCompletion = await client.chat.completions.create(
                    model=settings.model_generation,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    response_format={
                        "type": "json_schema",
                        "json_schema": {
                            "name": f"{channel.lower().replace(' ', '_')}_ad_copy",
                            "strict": True,
                            "schema": json_schema,
                        },
                    },
                    temperature=(base_temp := creativity_to_temperature(creativity)) + (option_num * 0.05),  # Vary temperature slightly for diversity
                )

                content = response.choices[0].message.content
                if not content:
                    raise ValueError("Empty response from OpenAI")

                parsed = json.loads(content)
                all_options.append(parsed)

                logger.info(f"Generated option {option_num + 1}/{num_options}")
                break  # Success, move to next option

            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error on attempt {attempt + 1}: {e}")
                if attempt == max_retries - 1:
                    raise
            except Exception as e:
                logger.error(f"Error generating copy on attempt {attempt + 1}: {e}")
                if attempt == max_retries - 1:
                    raise

    model_used = settings.model_generation
    logger.info(f"Successfully generated {len(all_options)} options using {model_used}")

    return all_options, model_used


async def shorten_text_with_llm(
    text: str,
    max_chars: int,
    keep_cta: bool = True,
    remove_emojis: bool = False,
) -> str:
    """
    Shorten text to fit within character limit while preserving meaning and impact.

    Args:
        text: Text to shorten
        max_chars: Maximum character count
        keep_cta: Whether to preserve call-to-action if present
        remove_emojis: Whether to remove emojis

    Returns:
        Shortened text
    """
    settings = get_settings()
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    current_length = len(text)
    if current_length <= max_chars:
        return text

    reduction_needed = current_length - max_chars
    percentage_reduction = (reduction_needed / current_length) * 100

    system_prompt = """You are an expert copywriter specializing in concise, impactful advertising copy.

Your task is to shorten ad copy while:
- Preserving the core message and value proposition
- Maintaining the tone and voice
- Keeping the most impactful words and phrases
- Ensuring the copy still drives action

Be ruthless with unnecessary words but preserve what matters most."""

    user_prompt = f"""Original copy ({current_length} characters):
{text}

Shorten this to a maximum of {max_chars} characters ({percentage_reduction:.0f}% reduction needed).

Requirements:
- Must be {max_chars} characters or less
- Preserve core message and impact
- {"Keep any call-to-action intact" if keep_cta else "CTA can be modified if needed"}
- {"Remove all emojis" if remove_emojis else "Emojis can be kept if space allows"}
- Maintain the same tone and voice

Return ONLY the shortened copy, nothing else."""

    try:
        response = await client.chat.completions.create(
            model=settings.model_generation,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,  # Lower temperature for more focused output
        )

        shortened = response.choices[0].message.content
        if not shortened:
            raise ValueError("Empty response from OpenAI")

        shortened = shortened.strip().strip('"')  # Remove any quotes

        # Verify length
        if len(shortened) <= max_chars:
            logger.info(f"Shortened text from {current_length} to {len(shortened)} chars")
            return shortened
        else:
            # Truncate if still too long (shouldn't happen but safety net)
            logger.warning(f"LLM output still too long ({len(shortened)}), truncating")
            return shortened[:max_chars].rsplit(" ", 1)[0] + "..."

    except Exception as e:
        logger.error(f"Error shortening text with LLM: {e}")
        # Fallback: simple truncation
        return text[:max_chars].rsplit(" ", 1)[0] + "..."


async def extract_usps_from_content(content: str) -> list[str]:
    """
    Extract 3-5 key USPs from landing page content.

    Args:
        content: Scraped landing page content

    Returns:
        List of 3-5 USP strings
    """
    settings = get_settings()
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    system_prompt = """You are an expert at analyzing university landing pages and extracting key selling points.

Your task is to identify the 3-5 most compelling USPs (Unique Selling Points) from the page content.

Good USPs are:
- Specific and concrete (not vague claims)
- Benefit-focused (what the student gets)
- Unique or differentiating
- Backed by evidence when possible (rankings, statistics, outcomes)

Examples:
- "95% graduate employment rate"
- "Award-winning teaching quality"
- "Industry placements with leading employers"
- "Ranked in top 10 for Computer Science"
- "£2,000 scholarships available"

Return ONLY the USPs, one per line, as a JSON array of strings."""

    user_prompt = f"""Analyze this landing page content and extract 3-5 key USPs:

{content[:3000]}  # Limit content to avoid token limits

Return a JSON array with 3-5 concise USP strings."""

    try:
        response = await client.chat.completions.create(
            model=settings.model_generation_mini,  # Use mini for speed
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "usps_extraction",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "usps": {
                                "type": "array",
                                "description": "List of 3-5 key USPs",
                                "items": {"type": "string"},
                                "minItems": 3,
                                "maxItems": 5,
                            }
                        },
                        "required": ["usps"],
                        "additionalProperties": False,
                    },
                },
            },
            temperature=0.3,
        )

        result = response.choices[0].message.content
        if not result:
            raise ValueError("Empty response from OpenAI")

        parsed = json.loads(result)
        usps = parsed.get("usps", [])

        logger.info(f"Extracted {len(usps)} USPs from content")
        return usps

    except Exception as e:
        logger.error(f"Error extracting USPs: {e}")
        # Return fallback USPs
        return [
            "Quality education",
            "Excellent facilities",
            "Strong graduate outcomes",
        ]
