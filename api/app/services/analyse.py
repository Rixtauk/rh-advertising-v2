"""Landing page analysis and scoring engine."""

import logging
import re
from datetime import datetime
from typing import Optional

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


def score_copy_quality(content: ScrapedContent, objective: ObjectiveType) -> tuple[CategoryScore, list[Issue]]:
    """
    Score copy quality (20 points max).

    Criteria:
    - Clear value proposition (5pts)
    - Appropriate length (5pts)
    - Clarity and readability (5pts)
    - Keyword optimization (5pts)
    """
    score = 0
    issues = []
    max_score = 20

    # Clear value proposition in H1 or first paragraph
    has_value_prop = False
    if content.h1 and len(content.h1[0]) > 20:
        has_value_prop = True
        score += 5
    elif content.paragraphs and len(content.paragraphs[0]) > 50:
        has_value_prop = True
        score += 3

    if not has_value_prop:
        issues.append(Issue(
            category="Copy Quality",
            severity="high",
            title="Missing clear value proposition",
            description="The H1 or opening paragraph should clearly communicate the unique value proposition.",
            suggestion="Add a compelling H1 that tells visitors exactly what they'll get. For example: 'Join 5,000+ Students at [University] - Apply Now for September 2025'",
            impact="Visitors may leave without understanding what you're offering"
        ))

    # Appropriate length
    word_count = content.word_count
    if 300 <= word_count <= 1500:
        score += 5
    elif 200 <= word_count < 300 or 1500 < word_count <= 2000:
        score += 3
        issues.append(Issue(
            category="Copy Quality",
            severity="medium",
            title="Suboptimal copy length",
            description=f"Page has {word_count} words. Ideal range is 300-1500 words for landing pages.",
            suggestion="Consider adding more descriptive content about the program, benefits, and student experience" if word_count < 300 else "Consider tightening the copy to focus on key messages and removing redundant content",
            impact="May not provide enough information to convince visitors" if word_count < 300 else "Visitors may lose interest in lengthy content"
        ))
    else:
        score += 1
        issues.append(Issue(
            category="Copy Quality",
            severity="high",
            title="Poor copy length",
            description=f"Page has {word_count} words. This is {'too short' if word_count < 200 else 'too long'} for effective conversion.",
            suggestion="Add substantive content about the program, benefits, faculty, and outcomes" if word_count < 200 else "Break content into sections, use tabs/accordions, or split into multiple pages",
            impact="Low conversion rate due to insufficient or overwhelming information"
        ))

    # Clarity and readability (check for short paragraphs, subheadings)
    if len(content.h2) >= 3 or len(content.h3) >= 3:
        score += 3
    else:
        issues.append(Issue(
            category="Copy Quality",
            severity="medium",
            title="Insufficient content structure",
            description=f"Only {len(content.h2)} H2 headings found. Content needs better organization.",
            suggestion="Break content into clear sections with descriptive subheadings like 'Why Choose Us', 'Course Details', 'Career Outcomes', 'How to Apply'",
            impact="Difficult to scan and find relevant information quickly"
        ))

    avg_paragraph_length = sum(len(p.split()) for p in content.paragraphs[:5]) / max(len(content.paragraphs[:5]), 1)
    if 15 <= avg_paragraph_length <= 50:
        score += 2

    # Education keyword optimization
    edu_keywords = [
        "university", "course", "degree", "program", "study", "student",
        "career", "graduate", "qualification", "apply", "admission", "tuition"
    ]
    markdown_lower = (content.markdown or "").lower()
    keyword_count = sum(1 for keyword in edu_keywords if keyword in markdown_lower)

    if keyword_count >= 5:
        score += 5
    elif keyword_count >= 3:
        score += 3
    else:
        issues.append(Issue(
            category="Copy Quality",
            severity="medium",
            title="Insufficient education keywords",
            description=f"Only {keyword_count} education-related keywords found in copy.",
            suggestion="Naturally incorporate keywords like 'degree', 'program', 'career outcomes', 'graduate employment', 'student experience'",
            impact="Lower search engine visibility and less clear educational context"
        ))

    percentage = int((score / max_score) * 100)
    return CategoryScore(
        score=score,
        max=max_score,
        grade=calculate_letter_grade(percentage),
        percentage=percentage
    ), issues


def score_ux_layout(content: ScrapedContent, objective: ObjectiveType) -> tuple[CategoryScore, list[Issue]]:
    """
    Score UX and layout (20 points max).

    Criteria:
    - Clear visual hierarchy (5pts)
    - Navigation structure (5pts)
    - Mobile considerations (5pts)
    - Information architecture (5pts)
    """
    score = 0
    issues = []
    max_score = 20

    # Clear visual hierarchy (H1 > H2 > H3 structure)
    if len(content.h1) == 1:
        score += 3
    elif len(content.h1) == 0:
        issues.append(Issue(
            category="UX/Layout",
            severity="high",
            title="Missing H1 heading",
            description="No H1 heading found on the page.",
            suggestion="Add a single, prominent H1 heading at the top of the page that clearly states the main purpose",
            impact="Poor accessibility and SEO; visitors unsure of page purpose"
        ))
    elif len(content.h1) > 1:
        issues.append(Issue(
            category="UX/Layout",
            severity="medium",
            title="Multiple H1 headings",
            description=f"Found {len(content.h1)} H1 headings. Should have exactly one.",
            suggestion="Use only one H1 for the main heading, convert others to H2 or H3",
            impact="Confusing hierarchy and reduced SEO effectiveness"
        ))

    if len(content.h2) >= 3:
        score += 2

    if len(content.h2) >= 3 and len(content.h3) >= 2:
        score += 2

    # Navigation structure (check for navigation links)
    nav_indicators = ["nav", "menu", "home", "about", "contact", "courses"]
    nav_link_count = sum(
        1 for link in content.links[:20]
        if any(nav_word in link.get("text", "").lower() or nav_word in link.get("href", "").lower()
               for nav_word in nav_indicators)
    )

    if nav_link_count >= 4:
        score += 5
    elif nav_link_count >= 2:
        score += 3
    else:
        issues.append(Issue(
            category="UX/Layout",
            severity="medium",
            title="Limited navigation detected",
            description="Navigation menu appears minimal or unclear.",
            suggestion="Add clear navigation with links to key pages: Home, Courses, About, Contact, Apply",
            impact="Visitors may struggle to explore other areas of the site"
        ))

    # Mobile considerations (no direct way to check, but can infer from responsive images)
    responsive_image_count = sum(
        1 for img in content.images[:10]
        if "responsive" in img.get("src", "").lower() or "-mobile" in img.get("src", "").lower()
    )

    # Assume modern sites are mobile-friendly, give benefit of doubt
    score += 4  # Default assumption for mobile responsiveness

    # Information architecture (appropriate number of sections)
    if 4 <= len(content.h2) <= 8:
        score += 4
    elif 3 <= len(content.h2) <= 10:
        score += 2
    else:
        issues.append(Issue(
            category="UX/Layout",
            severity="medium",
            title="Suboptimal content sections",
            description=f"Page has {len(content.h2)} main sections. Ideal is 4-8 sections.",
            suggestion="Organize content into 4-8 clear sections covering: Overview, Key Benefits, Details, How to Apply, FAQs, Contact",
            impact="Content may be too sparse or overwhelming"
        ))

    percentage = int((score / max_score) * 100)
    return CategoryScore(
        score=score,
        max=max_score,
        grade=calculate_letter_grade(percentage),
        percentage=percentage
    ), issues


def score_conversion_elements(content: ScrapedContent, objective: ObjectiveType) -> tuple[CategoryScore, list[Issue]]:
    """
    Score conversion elements (20 points max).

    Criteria:
    - Clear CTAs (8pts)
    - Forms presence and quality (7pts)
    - Trust signals (5pts)
    """
    score = 0
    issues = []
    max_score = 20

    # Clear CTAs
    cta_count = len(content.ctas)
    if cta_count >= 2:
        score += 8
    elif cta_count == 1:
        score += 5
        issues.append(Issue(
            category="Conversion Elements",
            severity="medium",
            title="Limited CTAs",
            description="Only one CTA found. Multiple CTAs increase conversion opportunities.",
            suggestion="Add a secondary CTA further down the page, such as 'Download Prospectus' or 'Book a Campus Tour'",
            impact="Missed conversion opportunities for visitors at different decision stages"
        ))
    else:
        score += 2
        issues.append(Issue(
            category="Conversion Elements",
            severity="high",
            title="No clear CTAs detected",
            description="No obvious call-to-action buttons found.",
            suggestion=f"Add prominent CTA buttons for '{objective}' - e.g., 'Register Now', 'Apply Today', 'Book Your Place'",
            impact="Visitors don't know what action to take next, leading to high bounce rates"
        ))

    # Forms presence and quality
    form_count = len(content.forms)
    if form_count >= 1:
        # Check form complexity
        avg_inputs = sum(f.get("inputs", 0) for f in content.forms) / form_count

        if 3 <= avg_inputs <= 8:
            score += 7
        elif 2 <= avg_inputs <= 12:
            score += 5
            if avg_inputs > 8:
                issues.append(Issue(
                    category="Conversion Elements",
                    severity="medium",
                    title="Form may be too long",
                    description=f"Form has {int(avg_inputs)} fields. Shorter forms typically convert better.",
                    suggestion="Reduce form fields to essentials only. Consider progressive disclosure or multi-step forms for longer data collection",
                    impact="Form abandonment due to friction"
                ))
        else:
            score += 3
            issues.append(Issue(
                category="Conversion Elements",
                severity="medium",
                title="Form complexity concerns",
                description=f"Form has {int(avg_inputs)} fields which may {'discourage' if avg_inputs > 12 else 'not capture enough'} conversions.",
                suggestion="Optimize form to 4-7 essential fields for better conversion rates",
                impact="Reduced form completion rates"
            ))
    else:
        if "Registration" in objective or "Enquiry" in objective or "Application" in objective:
            score += 2
            issues.append(Issue(
                category="Conversion Elements",
                severity="high",
                title="Missing form for objective",
                description=f"No form detected, but objective is '{objective}' which requires a form.",
                suggestion=f"Add a form for {objective} with fields like: Name, Email, Phone, Course Interest, Start Date",
                impact="Cannot capture leads or registrations - critical conversion blocker"
            ))
        else:
            score += 4  # Not critical for recruitment pages

    # Trust signals (testimonials, rankings, accreditation)
    trust_keywords = [
        "testimonial", "review", "rating", "ranked", "accredited", "certified",
        "award", "trusted", "students say", "graduate", "success", "employment"
    ]
    markdown_lower = (content.markdown or "").lower()
    trust_signal_count = sum(1 for keyword in trust_keywords if keyword in markdown_lower)

    if trust_signal_count >= 3:
        score += 5
    elif trust_signal_count >= 2:
        score += 3
    elif trust_signal_count >= 1:
        score += 2
    else:
        issues.append(Issue(
            category="Conversion Elements",
            severity="medium",
            title="Lacking trust signals",
            description="No testimonials, rankings, or credibility indicators found.",
            suggestion="Add student testimonials, league table rankings, accreditations (QAA, TEF Gold), graduate employment stats",
            impact="Visitors may question credibility and choose competitors"
        ))

    percentage = int((score / max_score) * 100)
    return CategoryScore(
        score=score,
        max=max_score,
        grade=calculate_letter_grade(percentage),
        percentage=percentage
    ), issues


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


def calculate_overall_score(
    content: ScrapedContent,
    objective: ObjectiveType,
    analysis_start_time: datetime
) -> OptimizeResponse:
    """
    Calculate overall landing page score across all categories.

    Returns comprehensive OptimizeResponse with scores, issues, and recommendations.
    """
    all_issues = []

    # Score each category
    copy_score, copy_issues = score_copy_quality(content, objective)
    all_issues.extend(copy_issues)

    ux_score, ux_issues = score_ux_layout(content, objective)
    all_issues.extend(ux_issues)

    conversion_score, conversion_issues = score_conversion_elements(content, objective)
    all_issues.extend(conversion_issues)

    seo_score, seo_issues = score_technical_seo(content)
    all_issues.extend(seo_issues)

    edu_score, edu_issues = score_education_specific(content, objective)
    all_issues.extend(edu_issues)

    accessibility_score, accessibility_issues = score_accessibility(content)
    all_issues.extend(accessibility_issues)

    # Calculate overall score
    overall_score = (
        copy_score.score +
        ux_score.score +
        conversion_score.score +
        seo_score.score +
        edu_score.score +
        accessibility_score.score
    )

    overall_grade = calculate_letter_grade(overall_score)

    # Extract quick wins
    quick_wins = extract_quick_wins(all_issues)

    # Create page summary
    summary = create_page_summary(content)

    # Calculate analysis time
    analysis_time_ms = int((datetime.now() - analysis_start_time).total_seconds() * 1000)

    logger.info(f"Landing page analysis complete: {overall_score}/100 ({overall_grade})")

    return OptimizeResponse(
        overall_score=overall_score,
        grade=overall_grade,
        objective=objective,
        url=str(content.markdown[:100]) if content.markdown else "unknown",  # Will be replaced with actual URL
        scores={
            "Copy Quality": copy_score,
            "UX/Layout": ux_score,
            "Conversion Elements": conversion_score,
            "Technical SEO": seo_score,
            "Education-Specific": edu_score,
            "Accessibility": accessibility_score,
        },
        issues=all_issues,
        quick_wins=quick_wins,
        summary=summary,
        scraped_at=datetime.now(),
        analysis_time_ms=analysis_time_ms
    )
