#!/bin/bash

# RH Advertising Deployment Script for DigitalOcean
# Usage: ./deploy.sh <droplet-ip> [ssh-user]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DROPLET_IP="${1}"
SSH_USER="${2:-deployer}"
APP_DIR="/home/${SSH_USER}/rh-advertising"
COMPOSE_FILE="docker-compose.prod.yml"

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate arguments
if [ -z "$DROPLET_IP" ]; then
    print_error "Usage: ./deploy.sh <droplet-ip> [ssh-user]"
    exit 1
fi

print_info "Starting deployment to ${DROPLET_IP}..."

# Check if .env exists locally
if [ ! -f .env ]; then
    print_warn ".env file not found locally. Make sure to create it on the server."
fi

# Create deployment archive
print_info "Creating deployment archive..."
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='__pycache__' \
    --exclude='.next' \
    --exclude='*.pyc' \
    --exclude='.env' \
    --exclude='*.tar.gz' \
    -czf rh-advertising-deploy.tar.gz .

# Copy archive to droplet
print_info "Copying files to droplet..."
scp rh-advertising-deploy.tar.gz ${SSH_USER}@${DROPLET_IP}:/tmp/

# Deploy on droplet
print_info "Deploying on droplet..."
ssh ${SSH_USER}@${DROPLET_IP} << 'ENDSSH'
set -e

# Create app directory if it doesn't exist
mkdir -p ~/rh-advertising
cd ~/rh-advertising

# Extract archive
echo "Extracting files..."
tar -xzf /tmp/rh-advertising-deploy.tar.gz
rm /tmp/rh-advertising-deploy.tar.gz

# Check if .env exists
if [ ! -f .env ]; then
    echo "WARNING: .env file not found. Please create it with your environment variables."
    echo "You can copy .env.example and modify it:"
    echo "  cp .env.example .env"
    echo "  nano .env"
fi

# Stop existing containers
echo "Stopping existing containers..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build images
echo "Building Docker images..."
docker compose -f docker-compose.prod.yml build --no-cache

# Start services
echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 10

# Check service status
echo "Checking service status..."
docker compose -f docker-compose.prod.yml ps

# Test API health
echo "Testing API health..."
curl -f http://localhost:8000/health || echo "WARNING: API health check failed"

echo "Deployment complete!"
ENDSSH

# Clean up local archive
rm rh-advertising-deploy.tar.gz

# Show final status
print_info "Deployment completed successfully!"
print_info "Checking final status..."

ssh ${SSH_USER}@${DROPLET_IP} "cd ${APP_DIR} && docker compose -f ${COMPOSE_FILE} ps"

print_info "To view logs, run:"
print_info "  ssh ${SSH_USER}@${DROPLET_IP} 'cd ${APP_DIR} && docker compose -f ${COMPOSE_FILE} logs -f'"

print_info "Access your application at: http://${DROPLET_IP}"
print_warn "Remember to set up Nginx reverse proxy and SSL for production use!"
