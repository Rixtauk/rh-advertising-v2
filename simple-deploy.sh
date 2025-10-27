#!/bin/bash
# Simple deployment for API only
# Paste this into your droplet console

cd /root/rh-advertising

# Build and run just the API service
docker build -t rh-ads-api ./api
docker stop rh-ads-api 2>/dev/null || true
docker rm rh-ads-api 2>/dev/null || true
docker run -d \
  --name rh-ads-api \
  --restart unless-stopped \
  -p 8000:8000 \
  --env-file .env \
  rh-ads-api

echo "API deployed! Check status with: docker logs rh-ads-api"
