# RH AI Assistant

> An intelligent SaaS web app for higher education advertising that generates compliant ad copy and provides creative asset specifications across 12+ advertising channels.

## Features

- **Ad Copy Generator**: Generate on-brand, compliant ad copy for 12 advertising channels
- **Character Limit Enforcement**: Automatic character counting with over-limit warnings and shortened alternatives
- **Creative Asset Specs**: Query image/video specifications for any channel
- **Landing Page Scraping**: Optional context extraction from landing pages to inform copy generation
- **Configurable Limits**: All platform rules and specs stored in version-controlled YAML files
- **Dual Backend Support**: OpenAI (default) or Make.com webhook integration
- **SQLite Persistence**: Generation history stored locally
- **Mock Mode**: Test without API keys

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI)
- **Database**: SQLite via Prisma
- **LLM**: OpenAI API or Make.com webhooks
- **Scraping**: Cheerio for server-side HTML parsing
- **Testing**: Chrome DevTools MCP integration

## Quick Start

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm, pnpm, or yarn

### Installation

1. **Clone and install dependencies:**

```bash
pnpm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:

```env
# App
NEXT_PUBLIC_APP_NAME="RH AI Assistant"
NODE_ENV=development
MOCK_MODE=false
GEN_BACKEND=OPENAI    # or MAKE

# OpenAI (if GEN_BACKEND=OPENAI)
OPENAI_API_KEY=your_openai_api_key_here

# Make.com (if GEN_BACKEND=MAKE)
MAKE_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
MAKE_RESULT_URL=

# Database (SQLite via Prisma)
DATABASE_URL="file:./dev.db"

# Password gate (disabled by default)
PASSWORD_GATE_ENABLED=false
PASSWORD_GATE_VALUE=changeme
```

3. **Initialize the database:**

```bash
pnpm prisma generate
pnpm prisma db push
```

4. **Start the development server:**

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

### Ad Copy Generator (`/copy`)

1. Select your advertising channel (Facebook, Instagram, LinkedIn, TikTok, etc.)
2. Choose communication type (Brand, Subject-specific, Open Day, Clearing)
3. Enter university name, tone of voice, target audience
4. Add USPs and key points
5. Optionally provide a landing page URL for context
6. Click **Generate Copy** to receive 3 variations

**Features:**
- Real-time character counters per field
- Over-limit warnings with shortened alternatives
- Copy to clipboard functionality
- Regenerate for 3 more options
- Post-generation asset spec recommendations

### Asset Specifications (`/assets`)

1. Select an advertising channel
2. View all creative asset requirements:
   - Aspect ratios
   - Recommended dimensions
   - File types and sizes
   - Duration limits
   - Platform-specific notes
3. Copy all specs to clipboard

## Configuration

### Ad Limits (`/data/ad_limits.yaml`)

Defines character and word limits for each channel and field:

```yaml
- channel: "Facebook"
  subtype: null
  fields:
    - field: "primary_text"
      max_chars: 125
      max_words: 0
      emojis_allowed: true
      notes: "Feeds - keeps text concise"
```

### Asset Specs (`/data/asset_specs.yaml`)

Defines creative asset requirements:

```yaml
- channel: "Facebook"
  placement_or_format: "Feed"
  aspect_ratio: "1:1"
  recommended_px: "1080x1080"
  duration_seconds_max: 0
  file_types: ["jpg", "png", "mp4", "mov"]
  max_file_size_mb: 30
  caption_limit_chars: 2200
  notes: "Keep text overlays minimal"
```

### Taxonomies (`/data/taxonomies.yaml`)

Defines available options for channels, tones, audiences, and communication types.

### Revalidating Configuration

After editing YAML files:

1. **Automatic**: Restart the dev server
2. **Manual**: Call the revalidation endpoint:

```bash
curl -X POST http://localhost:3000/api/config/revalidate
```

Configuration is cached for 10 minutes by default.

## Backend Modes

### OpenAI Mode (Default)

Set `GEN_BACKEND=OPENAI` and provide `OPENAI_API_KEY`.

- Uses `gpt-4o-mini` model
- Temperature: 0.8 (social channels) or 0.5 (search channels)
- Returns structured JSON with 3 variations

### Make.com Mode

Set `GEN_BACKEND=MAKE` and configure webhook URLs.

1. **POST to `MAKE_WEBHOOK_URL`**: Sends inputs and limits
2. **Receive response**: Expects 3 structured options
3. **Optional callback**: Make can POST results to `/api/make/webhook`

**Expected Make.com response format:**

```json
{
  "options": [
    {
      "option": 1,
      "fields": [
        {
          "field": "primary_text",
          "value": "Your ad copy here",
          "charCount": 120,
          "maxChars": 125,
          "isOverLimit": false
        }
      ]
    }
  ]
}
```

### Mock Mode

Set `MOCK_MODE=true` to test without API keys. Returns deterministic sample outputs.

## Password Gate

The app includes a disabled password gate for future use.

**To enable:**

```env
PASSWORD_GATE_ENABLED=true
PASSWORD_GATE_VALUE=your_secure_password
```

Users will be prompted to enter the password before accessing the app.

## Database

Generation history is stored in SQLite (`dev.db`).

**Schema:**

```prisma
model Generation {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  channel     String
  subtype     String?
  university  String?
  tone        String
  audience    String
  usps        String?
  landingUrl  String?
  inputsJson  String   // JSON snapshot of inputs
  limitsJson  String   // JSON snapshot of limits
  outputsJson String   // JSON snapshot of generated options
}
```

**Database commands:**

```bash
# View data in browser
pnpm prisma studio

# Create a migration
pnpm prisma migrate dev --name description

# Reset database
rm dev.db && pnpm prisma db push
```

## Testing

The app is configured for testing with Chrome DevTools MCP.

**Test scenarios:**

1. **Copy Generation**: Fill form (MOCK_MODE=true), generate copy, verify 3 options render
2. **Character Counters**: Check that counters display correctly per field
3. **Over-limit Handling**: Verify warnings and shortened alternatives appear
4. **Asset Specs**: Select channel, verify specs list renders
5. **Copy to Clipboard**: Test all clipboard functionality
6. **Config Revalidation**: Call `/api/config/revalidate`, verify cache clears

**Example test flow:**

```javascript
// Navigate to copy generator
await page.goto('http://localhost:3000/copy');

// Fill form
await page.fill('#university', 'Test University');
await page.selectOption('#channel', 'Facebook');
await page.selectOption('#subtype', 'Brand level recruitment');
await page.selectOption('#tone', 'Confident');
await page.selectOption('#audience', 'Undergraduates');
await page.fill('#usps', 'World-class research, vibrant campus life');

// Generate
await page.click('button[type="submit"]');

// Verify results
await page.waitForSelector('.result-card');
const results = await page.$$('.result-card');
expect(results.length).toBe(3);
```

## Project Structure

```
/app
  layout.tsx                    # Root layout with header/footer
  page.tsx                      # Homepage
  copy/
    page.tsx                    # Copy generator UI
    actions.ts                  # Server actions for generation
  assets/page.tsx               # Asset specs UI
  auth/page.tsx                 # Password gate page (disabled)
  api/
    assets/route.ts             # Asset specs API
    config/revalidate/route.ts  # Cache clearing
    make/webhook/route.ts       # Make.com callback
    auth/login/route.ts         # Password auth

/components
  forms/CopyForm.tsx            # Copy generator form
  results/CopyResults.tsx       # Generated copy display
  assets/SpecsList.tsx          # Asset specs list
  ui/*                          # shadcn/ui components

/data
  ad_limits.yaml                # Character limits by channel
  asset_specs.yaml              # Creative asset specs
  taxonomies.yaml               # Available options
  EXAMPLES.md                   # Configuration guide

/lib
  config.ts                     # YAML loader with caching
  llm.ts                        # OpenAI integration + mock mode
  make.ts                       # Make.com webhook client
  scrape.ts                     # Landing page scraper
  limits.ts                     # Limit formatting helpers
  clipboard.ts                  # Clipboard utilities
  prisma.ts                     # Prisma client singleton
  utils.ts                      # General utilities

/prisma
  schema.prisma                 # Database schema

middleware.ts                   # Password gate middleware
```

## Supported Channels

1. **Facebook** - Feed and Stories
2. **Instagram** - Feed and Stories
3. **LinkedIn** - Feed
4. **TikTok** - In-Feed Ads
5. **Snapchat** - Snap Ads
6. **X (Twitter)** - In-Feed
7. **Reddit** - Feed
8. **YouTube** - In-Stream and Discovery
9. **Google Search** - Text Ads (up to 15 headlines, 4 descriptions)
10. **Google Display** - Responsive Display Ads
11. **Performance Max** - Multi-format (15 headlines, 5 long headlines, 4 descriptions)
12. **Demand Gen** - Image/Video (5 headlines, 1 long headline, 5 descriptions)

## Compliance Note

**This tool provides initial draft copy. All claims must be verified before submitting to RH for build. Copy character limits may also need checking to ensure individual requirements.**

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

**Note**: SQLite database will be ephemeral on Vercel. For production, consider:
- PostgreSQL (via Vercel Postgres or Supabase)
- PlanetScale (MySQL)
- Update `DATABASE_URL` and re-run migrations

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t rh-ai-assistant .
docker run -p 3000:3000 --env-file .env.local rh-ai-assistant
```

## Contributing

### Adding a New Channel

1. Add to `data/taxonomies.yaml` (`all_channels` and appropriate category)
2. Define limits in `data/ad_limits.yaml`
3. Define asset specs in `data/asset_specs.yaml`
4. Test with MOCK_MODE=true

### Extending Field Types

Multi-field channels (like Google Search) use the `count` property:

```yaml
- field: "headlines"
  max_chars: 30
  count: 15  # Generate 15 variations
```

The LLM will return an array of strings for these fields.

## Troubleshooting

**"No limits found for channel"**
- Check that the channel name in YAML exactly matches the selected value
- Try calling `/api/config/revalidate`

**OpenAI API errors**
- Verify `OPENAI_API_KEY` is set correctly
- Check API quota and billing
- Set `MOCK_MODE=true` to bypass API

**Database errors**
- Delete `dev.db` and run `pnpm prisma db push`
- Ensure write permissions in the project directory

**YAML parsing errors**
- Validate YAML syntax at yamllint.com
- Check for consistent indentation (2 spaces)
- Ensure all string values with special characters are quoted

## License

© 2025 RH Creative. All rights reserved.

---

**Built with:**
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [OpenAI](https://openai.com/)
- [Tailwind CSS](https://tailwindcss.com/)
