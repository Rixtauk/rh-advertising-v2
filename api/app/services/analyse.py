"""Landing page analysis and scoring engine."""

import json
import logging
import re
from datetime import datetime
from typing import Optional

from openai import AsyncOpenAI

from app.deps import get_settings
from app.models.io import (
    CategoryScore,
    Issue,
    ObjectiveType,
    OptimizeResponse,
    PageSummary,
)
from app.services.scrape import ScrapedContent

logger = logging.getLogger(__name__)


def calculate_letter_grade(percentage: int) -> str:
    """Convert percentage to letter grade."""
    if percentage >= 90:
        return "A"
    elif percentage >= 80:
        return "B"
    elif percentage >= 70:
        return "C"
    elif percentage >= 60:
        return "D"
    else:
        return "F"


async def analyze_with_llm(prompt: str, max_score: int = 10) -> dict:
    """
    Analyze content using LLM with structured JSON output.

    Returns:
        dict with 'score' (0-max_score) and 'issues' (list of strings)
    """
    settings = get_settings()
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    json_schema = {
        "type": "object",
        "properties": {
            "score": {
                "type": "number",
                "description": f"Score from 0 to {max_score}",
                "minimum": 0,
                "maximum": max_score
            },
            "issues": {
                "type": "array",
                "description": "List of 2-3 specific, actionable issues",
                "items": {"type": "string"},
                "minItems": 0,
                "maxItems": 3
            }
        },
        "required": ["score", "issues"],
        "additionalProperties": False
    }

    try:
        response = await client.chat.completions.create(
            model=settings.model_generation_mini,  # Use mini for speed
            messages=[
                {"role": "user", "content": prompt}
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "landing_page_analysis",
                    "strict": True,
                    "schema": json_schema
                }
            },
            temperature=0.3  # Low temperature for consistent analysis
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("Empty response from OpenAI")

        result = json.loads(content)

        # Ensure score is within bounds
        result["score"] = max(0, min(max_score, result["score"]))

        return result

    except Exception as e:
        logger.error(f"Error in LLM analysis: {e}")
        # Return default values on error
        return {
            "score": max_score // 2,  # 50% score as fallback
            "issues": ["Unable to perform detailed analysis due to technical error"]
        }


async def score_copy_quality(content: ScrapedContent, objective: ObjectiveType) -> tuple[CategoryScore, list[Issue]]:
    """
    Score copy quality using LLM analysis (20 points max).

    Uses GPT-4o-mini to evaluate:
    - Value proposition clarity and specificity
    - Benefit focus vs feature focus
    - Content structure and flow
    - Brand voice appropriateness
    """
    max_score = 20

    # Prepare content for analysis
    h1_text = content.h1[0] if content.h1 else "No H1 found"
    h2_text = ", ".join(content.h2[:5]) if content.h2 else "No H2s found"
    paragraphs_text = " ".join(content.paragraphs[:3]) if content.paragraphs else "No content found"

    # Truncate to avoid token limits
    if len(paragraphs_text) > 1000:
        paragraphs_text = paragraphs_text[:1000] + "..."

    prompt = f"""You are an expert landing page analyst evaluating copy quality for a {objective} page.

Analyze this content:
H1: {h1_text}
H2s: {h2_text}
Content: {paragraphs_text}

Evaluate on this rubric (0-10 scale):
- Value proposition: Is it clear, specific, and compelling?
- Benefit focus: Does it emphasize outcomes, not just features?
- Content structure: Appropriate length, good flow, scannable?
- Brand voice: Professional, consistent, appropriate for higher education?

Provide:
1. Score (0-10, where 10 is excellent)
2. 2-3 specific, actionable issues to fix (if score < 9)

Return JSON: {{"score": X, "issues": ["...", "..."]}}"""

    # Get LLM analysis
    result = await analyze_with_llm(prompt, max_score=10)

    # Scale score to 20 points
    score = int(result["score"] * 2)

    # Convert issue strings to Issue objects
    issues = []
    for i, issue_text in enumerate(result["issues"]):
        # Determine severity based on score
        if result["score"] < 4:
            severity = "high"
        elif result["score"] < 7:
            severity = "medium"
        else:
            severity = "low"

        issues.append(Issue(
            category="Copy Quality",
            severity=severity,
            title=f"Copy improvement {i+1}",
            description=issue_text,
            suggestion=issue_text,
            impact="May reduce visitor engagement and conversion rates"
        ))

    percentage = int((score / max_score) * 100)
    return CategoryScore(
        score=score,
        max=max_score,
        grade=calculate_letter_grade(percentage),
        percentage=percentage
    ), issues


async def score_user_experience(content: ScrapedContent, objective: ObjectiveType) -> tuple[CategoryScore, list[Issue]]:
    """
    Score UX and usability using LLM analysis (20 points max).

    Uses GPT-4o-mini to evaluate:
    - Content hierarchy and structure
    - Readability and scannability
    - Information architecture
    - Mobile considerations
    """
    max_score = 20

    # Prepare structure summary
    h1_text = content.h1[0] if content.h1 else "No H1 found"
    h2_text = ", ".join(content.h2[:8]) if content.h2 else "No H2s found"

    structure_summary = f"{len(content.h1)} H1(s), {len(content.h2)} H2(s), {len(content.h3)} H3(s), {len(content.paragraphs)} paragraphs"

    prompt = f"""You are a UX expert evaluating landing page structure and usability.

Analyze this structure:
H1: {h1_text}
H2s: {h2_text}
Content hierarchy: {structure_summary}

Evaluate on this rubric (0-10 scale):
- Content hierarchy: Clear H1→H2 structure, logical flow?
- Readability: Appropriate paragraph length, easy to scan?
- Information architecture: Key info prioritized, easy to find?
- Mobile considerations: Structure works on mobile?

Provide:
1. Score (0-10, where 10 is excellent)
2. 2-3 specific improvements

Return JSON: {{"score": X, "issues": ["...", "..."]}}"""

    # Get LLM analysis
    result = await analyze_with_llm(prompt, max_score=10)

    # Scale score to 20 points
    score = int(result["score"] * 2)

    # Convert issue strings to Issue objects
    issues = []
    for i, issue_text in enumerate(result["issues"]):
        # Determine severity based on score
        if result["score"] < 4:
            severity = "high"
        elif result["score"] < 7:
            severity = "medium"
        else:
            severity = "low"

        issues.append(Issue(
            category="User Experience",
            severity=severity,
            title=f"UX improvement {i+1}",
            description=issue_text,
            suggestion=issue_text,
            impact="May hinder user navigation and page usability"
        ))

    percentage = int((score / max_score) * 100)
    return CategoryScore(
        score=score,
        max=max_score,
        grade=calculate_letter_grade(percentage),
        percentage=percentage
    ), issues


# Keep backward compatibility alias
score_ux_layout = score_user_experience


async def score_cta_effectiveness(content: ScrapedContent, objective: ObjectiveType) -> tuple[CategoryScore, list[Issue]]:
    """
    Score CTA effectiveness using LLM analysis (20 points max).

    Uses GPT-4o-mini to evaluate:
    - Action clarity and specificity
    - Urgency and motivation
    - CTA placement and visibility
    - Variety of conversion opportunities
    """
    max_score = 20

    # Prepare content context
    full_content = ""
    if content.ctas:
        full_content += f"CTAs found: {', '.join(content.ctas[:5])}\n"
    else:
        full_content += "No CTAs detected\n"

    if content.h1:
        full_content += f"H1: {content.h1[0]}\n"

    if content.paragraphs:
        full_content += f"Content: {' '.join(content.paragraphs[:2])[:500]}..."

    prompt = f"""You are an expert analyzing call-to-action effectiveness for a {objective} landing page.

Analyze these CTAs in context:
{full_content}

Evaluate on this rubric (0-10 scale):
- Action clarity: Are CTAs clear and specific?
- Urgency/motivation: Do they create desire to act?
- Placement: Are CTAs visible and well-positioned?
- Variety: Are there multiple conversion opportunities?

Provide:
1. Score (0-10, where 10 is excellent)
2. 2-3 specific improvements

Return JSON: {{"score": X, "issues": ["...", "..."]}}"""

    # Get LLM analysis
    result = await analyze_with_llm(prompt, max_score=10)

    # Scale score to 20 points
    score = int(result["score"] * 2)

    # Convert issue strings to Issue objects
    issues = []
    for i, issue_text in enumerate(result["issues"]):
        # Determine severity based on score
        if result["score"] < 4:
            severity = "high"
        elif result["score"] < 7:
            severity = "medium"
        else:
            severity = "low"

        issues.append(Issue(
            category="CTA Effectiveness",
            severity=severity,
            title=f"CTA improvement {i+1}",
            description=issue_text,
            suggestion=issue_text,
            impact="May reduce conversion rates and lead generation"
        ))

    percentage = int((score / max_score) * 100)
    return CategoryScore(
        score=score,
        max=max_score,
        grade=calculate_letter_grade(percentage),
        percentage=percentage
    ), issues


# Keep backward compatibility alias
score_conversion_elements = score_cta_effectiveness


def score_technical_seo(content: ScrapedContent) -> tuple[CategoryScore, list[Issue]]:
    """
    Score technical SEO (15 points max).

    Criteria:
    - Title tag optimization (5pts)
    - Meta description (5pts)
    - Image alt text (5pts)
    """
    score = 0
    issues = []
    max_score = 15

    # Title tag
    if content.title:
        title_length = len(content.title)
        if 30 <= title_length <= 60:
            score += 5
        elif 20 <= title_length <= 70:
            score += 3
            issues.append(Issue(
                category="Technical SEO",
                severity="low",
                title="Title tag length suboptimal",
                description=f"Title is {title_length} characters. Ideal is 30-60 characters.",
                suggestion="Adjust title to 30-60 characters for optimal display in search results",
                impact="Title may be truncated in search results"
            ))
        else:
            score += 1
            issues.append(Issue(
                category="Technical SEO",
                severity="medium",
                title="Title tag length poor",
                description=f"Title is {title_length} characters. Should be 30-60 characters.",
                suggestion="Rewrite title to be concise and keyword-rich: '[Degree Name] at [University] | Apply Now'",
                impact="Poor search result presentation and click-through rates"
            ))
    else:
        issues.append(Issue(
            category="Technical SEO",
            severity="high",
            title="Missing title tag",
            description="No title tag found.",
            suggestion="Add a descriptive title tag: '[Program Name] | [University] - [Key Benefit]'",
            impact="Severe SEO penalty and poor search result display"
        ))

    # Meta description
    if content.meta_description:
        desc_length = len(content.meta_description)
        if 120 <= desc_length <= 155:
            score += 5
        elif 100 <= desc_length <= 170:
            score += 3
            issues.append(Issue(
                category="Technical SEO",
                severity="low",
                title="Meta description length suboptimal",
                description=f"Meta description is {desc_length} characters. Ideal is 120-155.",
                suggestion="Adjust to 120-155 characters for optimal search result display",
                impact="Description may be truncated in search results"
            ))
        else:
            score += 1
            issues.append(Issue(
                category="Technical SEO",
                severity="medium",
                title="Meta description length poor",
                description=f"Meta description is {desc_length} characters.",
                suggestion="Write a compelling 120-155 character description highlighting key benefits and including a call-to-action",
                impact="Lower click-through rates from search results"
            ))
    else:
        issues.append(Issue(
            category="Technical SEO",
            severity="high",
            title="Missing meta description",
            description="No meta description found.",
            suggestion="Add a meta description that summarizes the page and includes target keywords and a CTA",
            impact="Search engines may generate poor automatic descriptions, reducing clicks"
        ))

    # Image alt text
    if content.images:
        images_with_alt = sum(1 for img in content.images if img.get("has_alt"))
        alt_text_percentage = (images_with_alt / len(content.images)) * 100

        if alt_text_percentage >= 90:
            score += 5
        elif alt_text_percentage >= 70:
            score += 4
        elif alt_text_percentage >= 50:
            score += 2
            issues.append(Issue(
                category="Technical SEO",
                severity="medium",
                title="Many images missing alt text",
                description=f"Only {int(alt_text_percentage)}% of images have alt text.",
                suggestion="Add descriptive alt text to all images, especially those showing campus, students, or facilities",
                impact="Reduced accessibility and SEO value"
            ))
        else:
            score += 1
            issues.append(Issue(
                category="Technical SEO",
                severity="high",
                title="Most images missing alt text",
                description=f"Only {int(alt_text_percentage)}% of images have alt text.",
                suggestion="Add alt text to all images: describe what's shown and include relevant keywords where appropriate",
                impact="Poor accessibility for screen readers and lost SEO opportunities"
            ))
    else:
        score += 3  # No images means no alt text issues

    percentage = int((score / max_score) * 100)
    return CategoryScore(
        score=score,
        max=max_score,
        grade=calculate_letter_grade(percentage),
        percentage=percentage
    ), issues


def score_education_specific(content: ScrapedContent, objective: ObjectiveType) -> tuple[CategoryScore, list[Issue]]:
    """
    Score education-specific elements (15 points max).

    Criteria:
    - Course/program details (5pts)
    - Entry requirements (3pts)
    - Dates and deadlines (3pts)
    - Student life/campus info (2pts)
    - Career outcomes (2pts)
    """
    score = 0
    issues = []
    max_score = 15
    markdown_lower = (content.markdown or "").lower()

    # Course/program details
    course_keywords = ["course", "program", "degree", "modules", "curriculum", "syllabus", "year"]
    course_mentions = sum(1 for keyword in course_keywords if keyword in markdown_lower)

    if course_mentions >= 4:
        score += 5
    elif course_mentions >= 2:
        score += 3
    else:
        issues.append(Issue(
            category="Education-Specific",
            severity="high",
            title="Insufficient course information",
            description="Limited details about course/program structure.",
            suggestion="Add sections covering: Course overview, Modules/Units, Year structure, Teaching methods, Assessment types",
            impact="Prospective students cannot evaluate if the program meets their needs"
        ))

    # Entry requirements
    entry_keywords = ["entry", "requirements", "ucas", "points", "grades", "qualification", "a-level", "btec"]
    if any(keyword in markdown_lower for keyword in entry_keywords):
        score += 3
    else:
        issues.append(Issue(
            category="Education-Specific",
            severity="high",
            title="Missing entry requirements",
            description="No clear entry requirements or qualifications listed.",
            suggestion="Add a section clearly stating: UCAS points, A-level grades, BTECs, GCSEs, or equivalent qualifications required",
            impact="Students unsure if they qualify, leading to enquiry friction"
        ))

    # Dates and deadlines
    date_patterns = [
        r"\b20\d{2}\b",  # Years like 2024, 2025
        r"\b(january|february|march|april|may|june|july|august|september|october|november|december)\b",
        r"\bdeadline\b",
        r"\bopen day\b",
        r"\bstart date\b",
    ]
    has_dates = any(re.search(pattern, markdown_lower) for pattern in date_patterns)

    if has_dates:
        score += 3
    else:
        if "Open Day" in objective:
            issues.append(Issue(
                category="Education-Specific",
                severity="high",
                title="Missing open day date",
                description="No date/time information found for the open day event.",
                suggestion="Prominently display: Date, Time, Campus location, Registration deadline",
                impact="Visitors cannot plan attendance - critical for registration conversion"
            ))
        else:
            issues.append(Issue(
                category="Education-Specific",
                severity="medium",
                title="No dates or deadlines shown",
                description="No course start dates, application deadlines, or key dates mentioned.",
                suggestion="Add key dates: Application deadlines, Course start dates, Open day dates",
                impact="Creates uncertainty and may cause students to defer their application"
            ))

    # Student life/campus info
    campus_keywords = ["campus", "accommodation", "facilities", "library", "sports", "societies", "student life", "location"]
    campus_mentions = sum(1 for keyword in campus_keywords if keyword in markdown_lower)

    if campus_mentions >= 2:
        score += 2
    elif campus_mentions >= 1:
        score += 1

    # Career outcomes
    career_keywords = ["career", "employment", "graduate", "job", "salary", "employer", "placement", "internship"]
    career_mentions = sum(1 for keyword in career_keywords if keyword in markdown_lower)

    if career_mentions >= 2:
        score += 2
    elif career_mentions >= 1:
        score += 1
    else:
        issues.append(Issue(
            category="Education-Specific",
            severity="medium",
            title="Missing career outcomes information",
            description="No information about graduate employment or career prospects.",
            suggestion="Add: Graduate employment rate, Average starting salary, Example employers, Career support services",
            impact="Students cannot assess ROI and career potential of the program"
        ))

    percentage = int((score / max_score) * 100)
    return CategoryScore(
        score=score,
        max=max_score,
        grade=calculate_letter_grade(percentage),
        percentage=percentage
    ), issues


def score_accessibility(content: ScrapedContent) -> tuple[CategoryScore, list[Issue]]:
    """
    Score accessibility (10 points max).

    Criteria:
    - Image alt text (covered in SEO) (4pts)
    - Semantic HTML structure (3pts)
    - Link text quality (3pts)
    """
    score = 0
    issues = []
    max_score = 10

    # Image alt text (already checked in SEO, replicate for accessibility context)
    if content.images:
        images_with_alt = sum(1 for img in content.images if img.get("has_alt"))
        alt_text_percentage = (images_with_alt / len(content.images)) * 100

        if alt_text_percentage >= 90:
            score += 4
        elif alt_text_percentage >= 70:
            score += 3
        elif alt_text_percentage >= 50:
            score += 2
        else:
            score += 1
            issues.append(Issue(
                category="Accessibility",
                severity="high",
                title="Poor image accessibility",
                description=f"Only {int(alt_text_percentage)}% of images have alt text.",
                suggestion="Add descriptive alt text to all images for screen reader users",
                impact="Users with visual impairments cannot understand image content"
            ))
    else:
        score += 4  # No images = no issue

    # Semantic HTML structure (check for proper heading hierarchy)
    has_h1 = len(content.h1) >= 1
    has_h2 = len(content.h2) >= 1

    if has_h1 and has_h2:
        score += 3
    elif has_h1 or has_h2:
        score += 2
    else:
        issues.append(Issue(
            category="Accessibility",
            severity="high",
            title="Poor semantic structure",
            description="Missing proper heading hierarchy (H1, H2, H3).",
            suggestion="Use semantic HTML with clear heading hierarchy for screen readers and navigation",
            impact="Screen reader users cannot efficiently navigate page content"
        ))

    # Link text quality (check for generic "click here" links)
    generic_link_texts = ["click here", "read more", "here", "link", "more"]
    generic_links = [
        link for link in content.links[:20]
        if link.get("text", "").lower().strip() in generic_link_texts
    ]

    if len(generic_links) == 0:
        score += 3
    elif len(generic_links) <= 2:
        score += 2
        issues.append(Issue(
            category="Accessibility",
            severity="low",
            title="Some generic link text found",
            description=f"Found {len(generic_links)} links with non-descriptive text like 'click here'.",
            suggestion="Use descriptive link text that makes sense out of context: 'Download course prospectus' instead of 'click here'",
            impact="Screen reader users cannot understand link purpose when tabbing through links"
        ))
    else:
        score += 1
        issues.append(Issue(
            category="Accessibility",
            severity="medium",
            title="Multiple generic links found",
            description=f"Found {len(generic_links)} links with generic text.",
            suggestion="Replace all 'click here' and 'read more' links with descriptive text",
            impact="Poor accessibility for screen reader users and reduced usability"
        ))

    percentage = int((score / max_score) * 100)
    return CategoryScore(
        score=score,
        max=max_score,
        grade=calculate_letter_grade(percentage),
        percentage=percentage
    ), issues


def extract_quick_wins(all_issues: list[Issue]) -> list[str]:
    """Extract 3-5 quick wins from high-severity issues."""
    high_priority = [issue for issue in all_issues if issue.severity == "high"]
    medium_priority = [issue for issue in all_issues if issue.severity == "medium"]

    quick_wins = []

    # Prioritize high-severity issues
    for issue in high_priority[:3]:
        quick_wins.append(f"**{issue.title}**: {issue.suggestion}")

    # Add medium-severity if we need more
    if len(quick_wins) < 3:
        for issue in medium_priority[:5 - len(quick_wins)]:
            quick_wins.append(f"**{issue.title}**: {issue.suggestion}")

    return quick_wins[:5]


def create_page_summary(content: ScrapedContent) -> PageSummary:
    """Create a summary of the page content."""
    return PageSummary(
        title=content.title,
        h1=content.h1[0] if content.h1 else None,
        meta_description=content.meta_description,
        cta_count=len(content.ctas),
        form_count=len(content.forms),
        has_testimonials="testimonial" in (content.markdown or "").lower() or "review" in (content.markdown or "").lower(),
        has_rankings="ranked" in (content.markdown or "").lower() or "ranking" in (content.markdown or "").lower(),
        word_count=content.word_count
    )


async def calculate_overall_score(
    content: ScrapedContent,
    objective: ObjectiveType,
    analysis_start_time: datetime
) -> OptimizeResponse:
    """
    Calculate overall landing page score across 3 core categories.

    Returns comprehensive OptimizeResponse with scores, issues, and recommendations.
    """
    all_issues = []

    # Score each category (3 categories only) - all using LLM analysis
    copy_score, copy_issues = await score_copy_quality(content, objective)
    all_issues.extend(copy_issues)

    ux_score, ux_issues = await score_user_experience(content, objective)
    all_issues.extend(ux_issues)

    conversion_score, conversion_issues = await score_cta_effectiveness(content, objective)
    all_issues.extend(conversion_issues)

    # Calculate overall score (out of 60 points)
    overall_score = (
        copy_score.score +
        ux_score.score +
        conversion_score.score
    )

    # Convert to percentage and then calculate grade
    overall_percentage = int((overall_score / 60) * 100)
    overall_grade = calculate_letter_grade(overall_percentage)

    # Extract quick wins
    quick_wins = extract_quick_wins(all_issues)

    # Create page summary
    summary = create_page_summary(content)

    # Calculate analysis time
    analysis_time_ms = int((datetime.now() - analysis_start_time).total_seconds() * 1000)

    logger.info(f"Landing page analysis complete: {overall_percentage}/100 ({overall_grade})")

    return OptimizeResponse(
        overall_score=overall_percentage,
        grade=overall_grade,
        objective=objective,
        url=str(content.markdown[:100]) if content.markdown else "unknown",  # Will be replaced with actual URL
        scores={
            "copy_quality": copy_score,
            "user_experience": ux_score,
            "cta_effectiveness": conversion_score,
        },
        issues=all_issues,
        quick_wins=quick_wins,
        summary=summary,
        scraped_at=datetime.now(),
        analysis_time_ms=analysis_time_ms
    )
