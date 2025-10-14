# Docker Deployment Guide

This guide covers running the RH AI Assistant application using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- OpenAI API key

## Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### 2. Production Deployment

Build and run both services in production mode:

```bash
docker-compose up -d
```

Access the application:
- Web UI: http://localhost:3000
- API docs: http://localhost:8000/docs

View logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f api
```

Stop services:

```bash
docker-compose down
```

### 3. Development Mode

For development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

This mode:
- Mounts source code as volumes
- Enables hot-reload for both services
- Uses debug logging
- Web runs on port 3001

## Configuration

### Environment Variables

All configuration is done via environment variables in `.env`:

#### Required

- `OPENAI_API_KEY` - Your OpenAI API key

#### Optional

- `MODEL_GENERATION` - Model for generation (default: gpt-4o)
- `MODEL_GENERATION_MINI` - Model for smaller tasks (default: gpt-4o-mini)
- `NEXT_PUBLIC_APP_NAME` - Application name (default: RH AI Assistant)
- `JINA_API_KEY` - Optional Jina.AI key for enhanced scraping
- `LOG_LEVEL` - Logging level: DEBUG, INFO, WARNING, ERROR (default: INFO)
- `DEBUG` - Enable debug mode: true/false (default: false)

### Configuration Files

The `/data` directory contains editable YAML configuration files:

- `ad_limits.yaml` - Character limits for each channel
- `asset_specs.yaml` - Creative asset specifications
- `taxonomies.yaml` - Tone hints and audience hints

Changes to these files require:

1. Edit the files locally in `/data`
2. Restart the API service:
   ```bash
   docker-compose restart api
   ```
3. Or call the reload endpoint:
   ```bash
   curl -X POST http://localhost:8000/v1/admin/reload-config
   ```

## Architecture

### Services

**API (FastAPI)**
- Port: 8000
- Endpoints: Ad copy generation, landing page optimization, asset specs
- Health check: GET /health

**Web (Next.js)**
- Port: 3000 (production) / 3001 (dev)
- UI for copy generation and landing page optimization
- Connects to API via NEXT_PUBLIC_API_URL

### Volumes

- `./data:/app/data:ro` - Configuration files (read-only for API)

### Networks

- Production: `rh-ads-network`
- Development: `rh-ads-network-dev`

## Health Checks

Both services have built-in health checks:

```bash
# Check API health
curl http://localhost:8000/health

# Check web health (returns HTTP status)
curl -I http://localhost:3000
```

Docker will automatically restart unhealthy containers.

## Troubleshooting

### API container won't start

Check logs:
```bash
docker-compose logs api
```

Common issues:
- Missing `OPENAI_API_KEY` - Check `.env` file
- Config file errors - Validate YAML syntax in `/data/*.yaml`

### Web container can't connect to API

1. Verify API is running:
   ```bash
   docker-compose ps
   ```

2. Check network connectivity:
   ```bash
   docker-compose exec web wget -O- http://api:8000/health
   ```

3. Verify `NEXT_PUBLIC_API_URL` in production points to internal service:
   - Production: Uses `http://api:8000` (internal Docker network)
   - Development: Uses `http://localhost:8000` (host network)

### Build failures

Clean rebuild:
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Permission errors

Ensure data files are readable:
```bash
chmod -R 644 data/*.yaml
```

## Production Deployment

### Recommended Setup

1. Use a reverse proxy (nginx, Traefik) for SSL termination
2. Set up proper environment variables (no defaults)
3. Configure logging aggregation
4. Set resource limits in docker-compose.yml:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Security Checklist

- [ ] Set unique `OPENAI_API_KEY`
- [ ] Remove default CORS origins
- [ ] Enable HTTPS via reverse proxy
- [ ] Set `DEBUG=false`
- [ ] Use `LOG_LEVEL=WARNING` or `ERROR` in production
- [ ] Regularly update Docker images
- [ ] Scan images for vulnerabilities: `docker scan rh-ads-api`

## Monitoring

### Container Stats

```bash
docker stats
```

### API Metrics

The API exposes basic metrics at:
- `/health` - Service status
- `/metrics` - Prometheus-compatible metrics (if enabled)

### Logs

Production logging best practices:
```bash
# Export logs
docker-compose logs > app.log

# Watch specific level
docker-compose logs api | grep ERROR
```

## Updating

### Pull Latest Changes

```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

### Update Config Only

```bash
# Edit data files
vim data/ad_limits.yaml

# Reload without restart
curl -X POST http://localhost:8000/v1/admin/reload-config
```

## Development

### Local Development Without Docker

If you prefer running services locally:

**API:**
```bash
cd api
pip install -e .
uvicorn app.main:app --reload --port 8000
```

**Web:**
```bash
cd web
npm install
PORT=3001 npm run dev
```

### Hot Reload in Docker

Use the development compose file for automatic code reloading:

```bash
docker-compose -f docker-compose.dev.yml up
```

Changes to Python and TypeScript files will trigger automatic reloads.

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Verify config files: `data/*.yaml`
- Review API docs: http://localhost:8000/docs
- Check health endpoints

## Reference

### Useful Commands

```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f [service]

# Restart service
docker-compose restart [service]

# Stop and remove
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Execute command in container
docker-compose exec api bash
docker-compose exec web sh

# Check running containers
docker-compose ps

# View resource usage
docker stats $(docker-compose ps -q)
```
