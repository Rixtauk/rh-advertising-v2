# RH Education Ads API

FastAPI backend for AI-powered ad copy generation and landing page optimization for higher education marketing.

## Features

### 1. Ad Copy Generation
- **Multi-channel support**: Meta, Google Search, Google Display, TikTok, Snapchat, LinkedIn, YouTube, Email, Display
- **Structured outputs**: Generates copy that adheres to channel-specific character limits
- **Landing page context**: Optionally scrapes landing page URLs to inform copy generation
- **Tone & audience targeting**: Customizable tone and audience with built-in hints
- **Character limit validation**: Automatic validation with warnings for over-limit fields
- **Multiple options**: Generates 3 variations per request

### 2. Landing Page Optimization
- **Objective-based analysis**: Tailored scoring for Open Day Registration, Pre-Clearing Enquiry, Application, or Recruitment pages
- **6-category scoring system**:
  - Copy Quality (20 points)
  - UX/Layout (20 points)
  - Conversion Elements (20 points)
  - Technical SEO (15 points)
  - Education-Specific (15 points)
  - Accessibility (10 points)
- **Actionable insights**: Issue detection with severity levels and specific suggestions
- **Quick wins**: Prioritized list of high-impact improvements
- **Jina.AI scraping**: Clean markdown extraction with selectolax fallback

### 3. Configuration APIs
- **Asset specifications**: Query creative asset requirements by channel
- **Ad limits**: Retrieve character limits for any channel/subtype combination
- **Hot reload**: Update YAML configs without restarting

### 4. Text Shortening
- **LLM-powered**: Intelligently reduces copy length while preserving meaning
- **CTA preservation**: Option to keep call-to-action intact
- **Emoji handling**: Optional emoji removal

## Quick Start

### Prerequisites

- Python 3.11+
- OpenAI API key
- (Optional) Jina.AI API key for enhanced scraping

### Installation

```bash
# Install dependencies
cd api
pip install -e .

# Or using pyproject.toml directly
pip install -r requirements.txt
```

### Configuration

Create `.env` file in `api/` directory:

```env
# Required
OPENAI_API_KEY=sk-...

# Optional
JINA_API_KEY=jina_...
MODEL_COPY=gpt-4o
CORS_ALLOW_ORIGINS=http://localhost:3000,http://localhost:3001
SCRAPE_TIMEOUT_SECONDS=10
CONFIG_CACHE_TTL_SECONDS=600
USER_AGENT=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
```

### Running

```bash
# Development
cd api
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

API will be available at:
- **API**: http://localhost:8000
- **Interactive docs**: http://localhost:8000/docs
- **OpenAPI spec**: http://localhost:8000/openapi.json

## API Endpoints

### Health

**GET** `/health`
```json
{
  "status": "ok",
  "model": "gpt-4o",
  "version": "0.1.0"
}
```

### Generate Ad Copy

**POST** `/v1/generate-copy`

```json
{
  "channel": "Meta",
  "subtype": "Single Image",
  "university": "University of Example",
  "tone": "Inspiring",
  "audience": "School Leavers",
  "usps": "Award-winning teaching, 95% graduate employment, vibrant campus life",
  "emojis_allowed": true,
  "landing_url": "https://example.ac.uk/courses/business"
}
```

**Response:**
```json
{
  "options": [
    {
      "option": 1,
      "fields": [
        {
          "field": "Primary Text",
          "value": "Transform your future at University of Example...",
          "char_count": 120,
          "max_chars": 125,
          "is_over_limit": false
        }
      ]
    }
  ],
  "warnings": [],
  "source": "openai",
  "model_used": "gpt-4o",
  "scraped_context": "...",
  "timings": {
    "scrape_ms": 1200,
    "generation_ms": 3500,
    "total_ms": 4700
  }
}
```

### Optimize Landing Page

**POST** `/v1/optimize-landing`

```json
{
  "url": "https://example.ac.uk/open-day",
  "objective": "Open Day Registration"
}
```

**Response:**
```json
{
  "overall_score": 72,
  "grade": "C",
  "objective": "Open Day Registration",
  "url": "https://example.ac.uk/open-day",
  "scores": {
    "Copy Quality": {
      "score": 15,
      "max": 20,
      "grade": "B",
      "percentage": 75
    }
  },
  "issues": [
    {
      "category": "Conversion Elements",
      "severity": "high",
      "title": "Missing form for objective",
      "description": "No form detected for Open Day Registration",
      "suggestion": "Add a registration form with Name, Email, Phone, Course Interest",
      "impact": "Cannot capture registrations - critical conversion blocker"
    }
  ],
  "quick_wins": [
    "**Missing form**: Add registration form",
    "**Missing open day date**: Display date and time prominently"
  ],
  "summary": {
    "title": "Open Day 2025",
    "h1": "Experience Campus Life",
    "cta_count": 1,
    "form_count": 0,
    "word_count": 650
  },
  "scraped_at": "2025-10-14T10:30:00Z",
  "analysis_time_ms": 450
}
```

### Shorten Text

**POST** `/v1/shorten`

```json
{
  "text": "Discover your potential at our award-winning university with exceptional teaching...",
  "max_chars": 80,
  "keep_cta": true,
  "remove_emojis": false
}
```

### Get Asset Specs

**GET** `/v1/asset-specs?channel=Meta`

```json
{
  "channel": "Meta",
  "specs": [
    {
      "channel": "Meta",
      "placement_or_format": "Single Image Ad",
      "aspect_ratio": "1:1, 4:5, 1.91:1",
      "recommended_px": "1080 x 1080",
      "file_types": ["JPG", "PNG"],
      "max_file_size_mb": 30,
      "caption_limit_chars": 125
    }
  ]
}
```

### Get Ad Limits

**GET** `/v1/ad-limits?channel=Meta&subtype=Single+Image`

```json
{
  "channel": "Meta",
  "subtype": "Single Image",
  "fields": [
    {
      "field": "Primary Text",
      "max_chars": 125,
      "max_words": 0,
      "emojis_allowed": true,
      "count": null
    }
  ]
}
```

### Reload Config

**POST** `/admin/reload-config`

```json
{
  "success": true,
  "message": "Configuration cache cleared successfully. 3 entries removed.",
  "cleared_entries": 3
}
```

## Architecture

```
api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app setup, CORS, routes
│   ├── deps.py              # Settings and dependencies
│   ├── config_loader.py     # YAML config loading with caching
│   ├── models/
│   │   ├── domain.py        # Domain entities (FieldLimit, AdLimit, etc.)
│   │   └── io.py            # Request/response models
│   ├── routes/
│   │   ├── generate.py      # Ad copy generation
│   │   ├── optimize.py      # Landing page analysis
│   │   ├── shorten.py       # Text shortening
│   │   ├── specs.py         # Asset specifications
│   │   ├── limits.py        # Ad limits
│   │   ├── health.py        # Health check
│   │   └── config.py        # Config management
│   └── services/
│       ├── llm.py           # OpenAI integration
│       ├── scrape.py        # Jina.AI & selectolax scraping
│       ├── analyse.py       # Landing page scoring engine
│       ├── shorten.py       # Text shortening logic
│       └── limits.py        # Limit resolution utilities
├── data/                    # Shared YAML configs (symlinked)
├── pyproject.toml
├── Dockerfile
└── README.md
```

## Configuration Files

### `data/ad_limits.yaml`
Defines character limits for each channel and subtype:

```yaml
- channel: "Meta"
  subtype: "Single Image"
  fields:
    - field: "Primary Text"
      max_chars: 125
      emojis_allowed: true
```

### `data/asset_specs.yaml`
Creative asset specifications:

```yaml
- channel: "Meta"
  placement_or_format: "Single Image Ad"
  aspect_ratio: "1:1, 4:5, 1.91:1"
  recommended_px: "1080 x 1080"
  file_types: ["JPG", "PNG"]
  max_file_size_mb: 30
```

### `data/taxonomies.yaml`
Available options for dropdowns:

```yaml
social_channels: ["Meta", "TikTok", "Snapchat", "LinkedIn"]
tones: ["Professional", "Friendly", "Inspiring", "Direct"]
audiences: ["School Leavers", "Mature Students", "Parents"]
```

## Landing Page Scoring

### Scoring Categories

1. **Copy Quality (20pts)**
   - Clear value proposition
   - Appropriate length (300-1500 words)
   - Readability and structure
   - Education keyword optimization

2. **UX/Layout (20pts)**
   - Visual hierarchy (H1 > H2 > H3)
   - Navigation structure
   - Mobile responsiveness
   - Information architecture

3. **Conversion Elements (20pts)**
   - Clear CTAs (multiple)
   - Form presence and quality
   - Trust signals (testimonials, rankings)

4. **Technical SEO (15pts)**
   - Title tag (30-60 chars)
   - Meta description (120-155 chars)
   - Image alt text

5. **Education-Specific (15pts)**
   - Course/program details
   - Entry requirements
   - Dates and deadlines
   - Career outcomes

6. **Accessibility (10pts)**
   - Image alt text
   - Semantic HTML structure
   - Link text quality

### Objectives

Each objective has specific scoring rules:

- **Open Day Registration**: Requires event date/time, registration form, campus information
- **Pre-Clearing Enquiry Form**: Emphasizes quick response, form simplicity, entry requirements
- **Application**: Focuses on application process clarity, requirements, deadlines
- **Recruitment Page**: Highlights course details, career outcomes, social proof

### Grade Scale

- **A**: 90-100 (Excellent)
- **B**: 80-89 (Good)
- **C**: 70-79 (Satisfactory)
- **D**: 60-69 (Needs Improvement)
- **F**: 0-59 (Poor)

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
ruff check app/
```

### Adding a New Channel

1. Add limits to `data/ad_limits.yaml`
2. Add specs to `data/asset_specs.yaml`
3. Create JSON schema in `data/schemas/` (if needed)
4. Test with `/v1/generate-copy`

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | OpenAI API key |
| `JINA_API_KEY` | No | - | Jina.AI API key (optional) |
| `MODEL_COPY` | No | `gpt-4o` | OpenAI model for copy generation |
| `CORS_ALLOW_ORIGINS` | No | `http://localhost:3000` | Comma-separated CORS origins |
| `SCRAPE_TIMEOUT_SECONDS` | No | `6` | Scraping timeout |
| `CONFIG_CACHE_TTL_SECONDS` | No | `600` | Config cache TTL (10 min) |
| `USER_AGENT` | No | Mozilla/5.0... | User agent for scraping |

## Logging

Logs are output to stdout in the format:
```
2025-10-14 10:30:00 - app.routes.generate - INFO - Generating copy for Meta - Single Image
```

Adjust log level in `app/main.py`:
```python
logging.basicConfig(level=logging.DEBUG)  # DEBUG, INFO, WARNING, ERROR
```

## Performance

- **Copy generation**: ~3-5s per request (3 options)
- **Landing page analysis**: ~2-4s (scraping + scoring)
- **Text shortening**: ~1-2s
- **Config queries**: <10ms (cached)

Optimization tips:
- Use Jina.AI API key for faster scraping
- Increase cache TTL for frequently accessed configs
- Deploy with multiple workers for concurrent requests

## Error Handling

All endpoints return consistent error responses:

```json
{
  "detail": "Error message here",
  "error": "Exception details"
}
```

Common status codes:
- `400`: Invalid request (missing channel, malformed URL)
- `404`: Resource not found (channel limits, specs)
- `500`: Server error (OpenAI API failure, scraping timeout)

## License

Proprietary - RH Advertising

## Support

For issues or questions, contact the development team.
