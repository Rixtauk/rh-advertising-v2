#!/bin/bash
# Complete deployment script for DigitalOcean droplet
# Run this directly in the droplet console

set -e

echo "Starting complete deployment..."

# Create production docker-compose file
cat > /root/rh-advertising/docker-compose.prod.yml << 'EOFCOMPOSE'
version: '3.8'

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: rh-ads-api
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - MODEL_GENERATION=${MODEL_GENERATION:-gpt-4o}
      - MODEL_GENERATION_MINI=${MODEL_GENERATION_MINI:-gpt-4o-mini}
      - REQUEST_TIMEOUT_SECONDS=${REQUEST_TIMEOUT_SECONDS:-20}
      - CORS_ALLOW_ORIGINS=${CORS_ALLOW_ORIGINS:-http://localhost:3000}
      - JINA_API_KEY=${JINA_API_KEY:-}
      - SCRAPE_TIMEOUT_SECONDS=${SCRAPE_TIMEOUT_SECONDS:-6}
      - USER_AGENT=${USER_AGENT:-RH-Edu-Ads-Bot/1.0}
      - LOG_LEVEL=${LOG_LEVEL:-INFO}
      - CONFIG_CACHE_TTL_SECONDS=${CONFIG_CACHE_TTL_SECONDS:-600}
      - DEBUG=${DEBUG:-false}
    volumes:
      - ./data:/app/data:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "python", "-c", "import requests; requests.get('http://localhost:8000/health')"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    container_name: rh-ads-web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME:-RH AI Assistant}
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://api:8000}
      - NODE_ENV=production
    volumes:
      - ./data:/app/data:ro
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => {if(r.statusCode!==200)throw new Error(r.statusCode)})"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  default:
    name: rh-ads-network
EOFCOMPOSE

echo "✓ Created docker-compose.prod.yml"

# Navigate to app directory
cd /root/rh-advertising

# Build Docker images
echo "Building Docker images (this will take 5-10 minutes)..."
docker compose -f docker-compose.prod.yml build

# Start services
echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 15

# Check status
echo "Checking service status..."
docker compose -f docker-compose.prod.yml ps

# Configure firewall
echo "Configuring firewall..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 8000/tcp
echo "y" | ufw enable

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo "Your application is accessible at:"
echo "  Frontend: http://174.138.68.128:3000"
echo "  API: http://174.138.68.128:8000"
echo "  API Docs: http://174.138.68.128:8000/docs"
echo ""
echo "To view logs:"
echo "  docker compose -f docker-compose.prod.yml logs -f"
echo ""
