# RH AI Assistant

AI-powered advertising tools for higher education marketing.

## 🚀 Live Application

- **Web App**: https://rh-advertising-v2.vercel.app
- **API**: https://rh-advertising-v2-production.up.railway.app
- **API Docs**: https://rh-advertising-v2-production.up.railway.app/docs

## Features

### 1. Ad Copy Generator
Generate compelling ad copy for 12+ advertising channels with:
- Channel-specific character limits
- Tone and audience targeting
- Landing page context scraping
- Multiple copy variations
- Character limit validation

### 2. Landing Page Optimizer
Analyze and optimize university landing pages with:
- 0-100 scoring system across 6 categories
- Objective-based analysis (Open Day, Pre-Clearing, Application, Recruitment)
- Actionable insights and quick wins
- Education-specific recommendations

### 3. Creative Asset Specifications
Query creative asset requirements by channel with detailed specs for:
- Dimensions and aspect ratios
- File formats and sizes
- Duration limits
- Platform-specific guidelines

## Architecture

This is a monorepo containing:

```
/
├── api/          # FastAPI backend (deployed on Railway)
├── web/          # Next.js 14 frontend (deployed on Vercel)
├── data/         # Shared YAML configuration
└── README.md     # This file
```

### Backend (FastAPI)
- **Technology**: Python 3.11+, FastAPI, Pydantic v2
- **AI**: OpenAI GPT-4o for copy generation and analysis
- **Scraping**: Jina.AI Reader API with selectolax fallback
- **Production**: https://rh-advertising-v2-production.up.railway.app
- **Local Dev**: http://localhost:8000

### Frontend (Next.js)
- **Technology**: Next.js 14 (App Router), TypeScript, React 18
- **UI**: Tailwind CSS + shadcn/ui
- **Production**: https://rh-advertising-v2.vercel.app
- **Local Dev**: http://localhost:3001

### Shared Configuration
- **ad_limits.yaml**: Character limits per channel/subtype
- **asset_specs.yaml**: Creative asset specifications
- **taxonomies.yaml**: Controlled vocabularies (channels, tones, audiences)
- **schemas/**: JSON schemas for structured LLM outputs

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- OpenAI API key

### 1. Install Dependencies

**Backend:**
```bash
cd api
python3 -m pip install fastapi uvicorn pydantic pydantic-settings openai httpx pyyaml selectolax --user
```

**Frontend:**
```bash
cd web
npm install
```

### 2. Configure Environment

**Backend (.env in api/):**
```env
OPENAI_API_KEY=sk-...
JINA_API_KEY=jina_...  # Optional
MODEL_GENERATION=gpt-4o
CORS_ALLOW_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Frontend (.env.local in web/):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd api
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd web
PORT=3001 npm run dev
```

**Access:**
- Frontend: http://localhost:3001
- API Docs: http://localhost:8000/docs
- API: http://localhost:8000

## API Endpoints

### Copy Generation
```bash
POST /v1/generate-copy
{
  "channel": "Facebook",
  "subtype": "Brand level recruitment",
  "university": "University of Example",
  "tone": "Inspiring",
  "audience": "School Leavers",
  "usps": "Award-winning teaching, 95% employment rate",
  "emojis_allowed": true,
  "landing_url": "https://example.ac.uk/courses"
}
```

### Landing Page Optimization
```bash
POST /v1/optimize-landing
{
  "url": "https://example.ac.uk/open-day",
  "objective": "Open Day Registration"
}
```

### Configuration
```bash
GET  /v1/ad-limits?channel=Facebook&subtype=Brand%20level%20recruitment
GET  /v1/asset-specs?channel=Facebook
POST /admin/reload-config
```

## Configuration

### Adding a New Channel

**1. Update ad_limits.yaml:**
```yaml
- channel: "NewChannel"
  subtype: "Brand level recruitment"
  fields:
    - field: "primary_text"
      max_chars: 150
      max_words: 0
      emojis_allowed: true
```

**2. Update asset_specs.yaml:**
```yaml
- channel: "NewChannel"
  placement_or_format: "Feed"
  aspect_ratio: "1:1"
  recommended_px: "1080x1080"
  file_types: ["jpg", "png"]
  max_file_size_mb: 30
  duration_seconds_max: 0
  caption_limit_chars: 0
```

**3. Update taxonomies.yaml:**
```yaml
all_channels:
  - "NewChannel"
  # ... existing channels
```

**4. Reload config:**
```bash
curl -X POST http://localhost:8000/admin/reload-config
```

### Adding a Subtype

Duplicate any channel block in `ad_limits.yaml` and change the `subtype` field:

```yaml
- channel: "Facebook"
  subtype: "Open Day"  # New subtype
  fields:
    - field: "primary_text"
      max_chars: 125
      max_words: 0
      emojis_allowed: true
      notes: "Emphasize date/time and registration"
```

## Project Structure

### API (`/api`)
```
api/
├── app/
│   ├── main.py              # FastAPI app setup
│   ├── deps.py              # Settings and dependencies
│   ├── config_loader.py     # YAML config with caching
│   ├── models/
│   │   ├── domain.py        # Domain entities
│   │   └── io.py            # Request/response models
│   ├── routes/
│   │   ├── generate.py      # Copy generation
│   │   ├── optimize.py      # Landing page analysis
│   │   ├── shorten.py       # Text shortening
│   │   ├── specs.py         # Asset specifications
│   │   ├── limits.py        # Ad limits
│   │   ├── health.py        # Health check
│   │   └── config.py        # Config management
│   └── services/
│       ├── llm.py           # OpenAI integration
│       ├── scrape.py        # Jina.AI scraping
│       ├── analyse.py       # Landing page scoring
│       ├── shorten.py       # Text shortening
│       └── limits.py        # Limit validation
├── pyproject.toml
└── README.md
```

### Web (`/web`)
```
web/
├── app/
│   ├── copy/                # Copy generator page
│   ├── assets/              # Asset specs page
│   └── optimize/            # Landing page optimizer (TODO)
├── components/
│   ├── forms/               # Form components
│   ├── results/             # Result displays
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── config.ts            # YAML loading (client)
│   ├── llm.ts               # OpenAI (to be replaced with API)
│   └── make.ts              # Make.com (to be removed)
└── package.json
```

### Data (`/data`)
```
data/
├── ad_limits.yaml           # Character limits by channel
├── asset_specs.yaml         # Creative specs by channel
├── taxonomies.yaml          # Controlled vocabularies
└── schemas/
    ├── social.json          # Social media output schema
    └── google_search.json   # Google Search RSA schema
```

## Landing Page Scoring

The optimizer scores pages 0-100 across 6 categories:

1. **Copy Quality (20pts)**: Value proposition, length, readability, keywords
2. **UX/Layout (20pts)**: Visual hierarchy, navigation, mobile, information architecture
3. **Conversion Elements (20pts)**: CTAs, forms, trust signals
4. **Technical SEO (15pts)**: Title tag, meta description, image alt text
5. **Education-Specific (15pts)**: Course details, entry requirements, dates, career outcomes
6. **Accessibility (10pts)**: Alt text, semantic HTML, link quality

**Grade Scale:**
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: 0-59

## Development

### Running Tests

**Backend:**
```bash
cd api
pytest
```

**Frontend:**
```bash
cd web
npm test
```

### Code Formatting

**Backend:**
```bash
cd api
black app/
ruff check app/
```

**Frontend:**
```bash
cd web
npm run lint
```

## Deployment

### Production (Railway + Vercel)

The application is deployed as two separate services:

#### Backend on Railway

1. **Connect GitHub Repository**
   - Go to https://railway.app
   - Create new project from GitHub repo
   - Select this repository

2. **Configure Environment Variables** in Railway dashboard:
   ```
   OPENAI_API_KEY=sk-your-key-here
   JINA_API_KEY=jina_your-key-here
   MODEL_GENERATION=gpt-4o
   MODEL_GENERATION_MINI=gpt-4o-mini
   REQUEST_TIMEOUT_SECONDS=20
   LOG_LEVEL=INFO
   CORS_ALLOW_ORIGINS=https://rh-advertising-v2.vercel.app,https://rh-advertising-v2-*.vercel.app
   ```

3. **Deploy**
   - Railway auto-detects `nixpacks.toml`
   - Builds from `/api` directory
   - Copies `/data` directory during build
   - Auto-generates public URL

#### Frontend on Vercel

1. **Import GitHub Repository**
   - Go to https://vercel.com/new
   - Import this repository
   - **Set Root Directory**: `web`

2. **Configure Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
   API_URL=https://your-railway-url.up.railway.app
   ```
   ⚠️ **Note**: You need BOTH variables:
   - `NEXT_PUBLIC_API_URL` for client-side components
   - `API_URL` for server actions

3. **Deploy**
   - Vercel auto-detects Next.js
   - Builds and deploys from `/web` directory
   - Auto-deploys on every GitHub push

#### Why Two Deployments?

- **Frontend (Vercel)**: Optimized for Next.js, global CDN, instant deploys
- **Backend (Railway)**: Supports long-running processes, no timeout issues for AI requests

### Docker (Local/Self-Hosted)

Full Docker and Docker Compose support is available. See [DOCKER.md](DOCKER.md) for complete documentation.

**Quick Start:**
```bash
# Production
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
docker-compose -f docker-compose.prod.yml up -d

# Development (with hot-reload)
docker-compose up
```

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Environment Variables

**Backend Environment Variables:**
- `OPENAI_API_KEY`: Required - Your OpenAI API key
- `JINA_API_KEY`: Optional - Enhances web scraping
- `MODEL_GENERATION`: Default `gpt-4o`
- `MODEL_GENERATION_MINI`: Default `gpt-4o-mini`
- `CORS_ALLOW_ORIGINS`: Comma-separated list of allowed frontend URLs
- `REQUEST_TIMEOUT_SECONDS`: Default `20`
- `LOG_LEVEL`: Default `INFO`

**Frontend Environment Variables:**
- `NEXT_PUBLIC_API_URL`: API URL for client-side (required in Vercel)
- `API_URL`: API URL for server actions (required in Vercel)

## Documentation

- **API Documentation**: See [api/README.md](api/README.md)
- **Web Documentation**: See [web/README.md](web/README.md)
- **Interactive API Docs (Production)**: https://rh-advertising-v2-production.up.railway.app/docs
- **Interactive API Docs (Local)**: http://localhost:8000/docs
- **Deployment Guides**:
  - [Railway Deployment](RAILWAY_DEPLOYMENT.md)
  - [Docker Deployment](DOCKER.md)
  - [DigitalOcean Deployment](DEPLOYMENT.md)

## Support

For issues or questions, contact the development team.

## License

Proprietary - RH Advertising
