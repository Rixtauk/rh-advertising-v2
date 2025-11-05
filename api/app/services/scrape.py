"""Landing page scraping using Firecrawl API."""

import logging
import re
from typing import Optional

import httpx
from selectolax.parser import HTMLParser

from app.deps import get_settings

logger = logging.getLogger(__name__)


class ScrapedContent:
    """Container for scraped page content."""

    def __init__(self):
        self.title: Optional[str] = None
        self.meta_description: Optional[str] = None
        self.h1: list[str] = []
        self.h2: list[str] = []
        self.h3: list[str] = []
        self.ctas: list[str] = []
        self.forms: list[dict] = []
        self.images: list[dict] = []
        self.links: list[dict] = []
        self.paragraphs: list[str] = []
        self.lists: list[str] = []
        self.markdown: Optional[str] = None
        self.word_count: int = 0
        self.error: Optional[str] = None


async def scrape_with_firecrawl(url: str) -> ScrapedContent:
    """
    Scrape URL using Firecrawl API.

    Firecrawl provides clean markdown extraction and handles JavaScript-heavy sites.
    """
    settings = get_settings()
    content = ScrapedContent()

    try:
        firecrawl_url = "https://api.firecrawl.dev/v1/scrape"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.firecrawl_api_key}"
        }
        payload = {
            "url": url,
            "formats": ["markdown"],
            "onlyMainContent": True
        }

        async with httpx.AsyncClient(timeout=settings.scrape_timeout_seconds) as client:
            response = await client.post(firecrawl_url, headers=headers, json=payload)
            response.raise_for_status()

            data = response.json()

            # Firecrawl returns clean markdown and structured data
            content.markdown = data.get("data", {}).get("markdown", "")
            content.title = data.get("data", {}).get("metadata", {}).get("title")
            content.meta_description = data.get("data", {}).get("metadata", {}).get("description")

            # Parse markdown for structure
            if content.markdown:
                content.word_count = len(content.markdown.split())

                # Match both ATX-style (# Heading) and setext-style (Heading\n===)
                # ATX H1: # Heading
                atx_h1 = re.findall(r"^# (.+)$", content.markdown, re.MULTILINE)
                # Setext H1: Heading\n===
                setext_h1 = re.findall(r"^(.+)\n=+$", content.markdown, re.MULTILINE)
                content.h1 = atx_h1 + setext_h1

                # ATX H2: ## Heading
                atx_h2 = re.findall(r"^## (.+)$", content.markdown, re.MULTILINE)
                # Setext H2: Heading\n---
                setext_h2 = re.findall(r"^(.+)\n-+$", content.markdown, re.MULTILINE)
                content.h2 = atx_h2 + setext_h2

                content.h3 = []  # Not needed - removed to reduce noise
                content.paragraphs = [
                    p.strip()
                    for p in content.markdown.split("\n\n")
                    if p.strip() and not p.startswith("#") and not p.strip().startswith("=") and not p.strip().startswith("-")
                ][:5]  # First 5 paragraphs only

            logger.info(f"Scraped {url} via Firecrawl: {content.word_count} words")
            return content

    except httpx.TimeoutException:
        logger.warning(f"Timeout scraping {url} with Firecrawl")
        content.error = "Timeout: Site took too long to respond"
    except httpx.HTTPStatusError as e:
        logger.warning(f"HTTP error scraping {url}: {e.response.status_code}")
        content.error = f"Access denied: HTTP {e.response.status_code}"
    except Exception as e:
        logger.error(f"Error scraping {url} with Firecrawl: {e}")
        content.error = str(e)

    return content


async def scrape_with_selectolax(url: str) -> ScrapedContent:
    """
    Fallback scraper using direct HTML parsing with selectolax.

    Used if Jina.AI fails or for detailed HTML structure analysis.
    """
    settings = get_settings()
    content = ScrapedContent()

    try:
        headers = {"User-Agent": settings.user_agent}

        async with httpx.AsyncClient(timeout=settings.scrape_timeout_seconds) as client:
            response = await client.get(url, headers=headers, follow_redirects=True)
            response.raise_for_status()

            html = response.text
            tree = HTMLParser(html)

            # Basic metadata
            title_tag = tree.css_first("title")
            content.title = title_tag.text().strip() if title_tag else None

            meta_desc = tree.css_first('meta[name="description"]')
            if meta_desc:
                content.meta_description = meta_desc.attributes.get("content", "").strip()

            # Headings
            content.h1 = [h.text().strip() for h in tree.css("h1") if h.text().strip()]
            content.h2 = [h.text().strip() for h in tree.css("h2") if h.text().strip()]
            content.h3 = []  # Not needed - removed to reduce noise

            # CTAs (buttons and links with CTA keywords)
            # Expanded keywords and selectors to catch more CTAs
            cta_keywords = [
                "register",
                "apply",
                "book",
                "enquire",
                "download",
                "sign up",
                "get started",
                "learn more",
                "find out",
                "discover",
                "explore",
                "join",
                "visit",
                "open day",
                "prospectus",
                "contact",
                "get in touch",
            ]
            # Check buttons, links with button classes, and common CTA containers
            for btn in tree.css("button, a.btn, a.button, .cta, .btn, .button, a[role='button'], input[type='submit']"):
                text = btn.text().strip()
                if text:  # Any button/CTA element with text
                    text_lower = text.lower()
                    # Add if it contains CTA keywords OR if it's a button element (likely a CTA)
                    if any(keyword in text_lower for keyword in cta_keywords) or btn.tag in ["button", "input"]:
                        if text not in content.ctas:  # Avoid duplicates
                            content.ctas.append(text)

            # Forms
            for form in tree.css("form"):
                inputs = len(form.css("input, textarea, select"))
                content.forms.append({"inputs": inputs})

            # Images - not needed, removed to reduce noise
            content.images = []

            # Links - not needed, removed to reduce noise
            content.links = []

            # Paragraphs - limit to first 5 only
            content.paragraphs = [
                p.text().strip() for p in tree.css("p") if p.text().strip()
            ][:5]

            # Word count
            body = tree.css_first("body")
            if body:
                content.word_count = len(body.text().split())

            logger.info(f"Scraped {url} with selectolax: {content.word_count} words")
            return content

    except httpx.TimeoutException:
        logger.warning(f"Timeout scraping {url} with selectolax")
        content.error = "Timeout: Site took too long to respond"
    except httpx.HTTPStatusError as e:
        logger.warning(f"HTTP error scraping {url}: {e.response.status_code}")
        content.error = f"Access denied: HTTP {e.response.status_code}"
    except Exception as e:
        logger.error(f"Error scraping {url} with selectolax: {e}")
        content.error = str(e)

    return content


async def scrape_landing_page(url: str, use_firecrawl: bool = True) -> ScrapedContent:
    """
    Scrape landing page using preferred method.

    Args:
        url: Page URL to scrape
        use_firecrawl: Whether to try Firecrawl first (default True)

    Returns:
        ScrapedContent with extracted page data
    """
    if use_firecrawl:
        content = await scrape_with_firecrawl(url)
        if not content.error:
            return content
        logger.info(f"Firecrawl failed, falling back to selectolax for {url}")

    return await scrape_with_selectolax(url)


def format_scraped_summary(content: ScrapedContent) -> str:
    """Format scraped content into a concise summary for LLM context."""
    parts = []

    if content.title:
        parts.append(f"Title: {content.title}")

    if content.meta_description:
        parts.append(f"Description: {content.meta_description}")

    if content.h1:
        parts.append(f"Main heading: {content.h1[0]}")

    if content.h2:
        parts.append(f"Subheadings: {', '.join(content.h2[:3])}")

    if content.paragraphs:
        parts.append(f"Key content: {content.paragraphs[0][:200]}...")

    if content.ctas:
        parts.append(f"CTAs: {', '.join(content.ctas[:3])}")

    return "\n".join(parts) if parts else "No content extracted"
