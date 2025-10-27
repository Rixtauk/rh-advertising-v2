# Deploying to DigitalOcean Droplet

This guide will walk you through deploying the RH Advertising application to a DigitalOcean droplet using Docker.

## Prerequisites

- DigitalOcean account
- SSH key configured in DigitalOcean
- Domain name (optional, but recommended)

## Step 1: Create a DigitalOcean Droplet

### Option A: Using DigitalOcean Web Console

1. Log in to your DigitalOcean account
2. Click "Create" → "Droplets"
3. Choose an image: **Ubuntu 22.04 LTS**
4. Choose a plan: **Basic** (minimum 2GB RAM recommended)
5. Choose a datacenter region closest to your users
6. Add your SSH key
7. Choose a hostname (e.g., `rh-ads-server`)
8. Click "Create Droplet"

### Option B: Using doctl CLI

```bash
# Install doctl and authenticate
doctl compute droplet create rh-ads-server \
  --image ubuntu-22-04-x64 \
  --size s-2vcpu-4gb \
  --region nyc1 \
  --ssh-keys <your-ssh-key-id>
```

## Step 2: Initial Server Setup

SSH into your droplet:

```bash
ssh root@<your-droplet-ip>
```

### Update system packages

```bash
apt update && apt upgrade -y
```

### Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### Create a non-root user (recommended)

```bash
# Create user
adduser deployer
usermod -aG sudo deployer
usermod -aG docker deployer

# Copy SSH keys to new user
rsync --archive --chown=deployer:deployer ~/.ssh /home/deployer

# Switch to new user
su - deployer
```

## Step 3: Prepare Application Files

### Option A: Using Git (Recommended)

```bash
# On the droplet
cd ~
git clone <your-repository-url> rh-advertising
cd rh-advertising
```

### Option B: Using SCP

```bash
# On your local machine
cd "/Users/rickyvalentine/Claude Code Projects/RH Advertising V2"

# Create a tarball excluding unnecessary files
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='__pycache__' \
    --exclude='.next' \
    --exclude='.env' \
    -czf rh-advertising.tar.gz .

# Copy to droplet
scp rh-advertising.tar.gz deployer@<your-droplet-ip>:~/

# On the droplet, extract the archive
ssh deployer@<your-droplet-ip>
mkdir -p ~/rh-advertising
cd ~/rh-advertising
tar -xzf ../rh-advertising.tar.gz
rm ../rh-advertising.tar.gz
```

## Step 4: Configure Environment Variables

Create a `.env` file on the droplet:

```bash
cd ~/rh-advertising
nano .env
```

Add the following (adjust values as needed):

```env
# API Configuration
OPENAI_API_KEY=your-openai-api-key-here
MODEL_GENERATION=gpt-4o
MODEL_GENERATION_MINI=gpt-4o-mini
REQUEST_TIMEOUT_SECONDS=20
JINA_API_KEY=your-jina-api-key-here
SCRAPE_TIMEOUT_SECONDS=6
USER_AGENT=RH-Edu-Ads-Bot/1.0
LOG_LEVEL=INFO
CONFIG_CACHE_TTL_SECONDS=600
DEBUG=false

# Web Configuration
NEXT_PUBLIC_APP_NAME=RH AI Assistant
NEXT_PUBLIC_API_URL=http://api:8000

# CORS Configuration (update with your domain)
CORS_ALLOW_ORIGINS=http://localhost:3000,http://<your-droplet-ip>:3000,https://<your-domain>
```

## Step 5: Create Production Docker Compose Configuration

The production docker-compose file is already configured. Review `docker-compose.prod.yml`:

```bash
cat docker-compose.prod.yml
```

## Step 6: Deploy the Application

### Build and start the containers

```bash
# Build images
docker compose -f docker-compose.prod.yml build

# Start services in detached mode
docker compose -f docker-compose.prod.yml up -d

# Check if services are running
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

### Verify deployment

```bash
# Check API health
curl http://localhost:8000/health

# Check web frontend
curl http://localhost:3000
```

## Step 7: Configure Firewall

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw --force enable

# Check status
sudo ufw status
```

## Step 8: Set Up Nginx Reverse Proxy (Recommended)

### Install Nginx

```bash
sudo apt install nginx -y
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/rh-advertising
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name <your-domain-or-ip>;

    # Increase timeouts for long-running requests
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API docs
    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # API health check
    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
```

### Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/rh-advertising /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 9: Set Up SSL with Let's Encrypt (If using a domain)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d <your-domain>

# Certbot will automatically configure Nginx for HTTPS
# Certificates will auto-renew
```

## Step 10: Set Up Auto-start on Boot

Docker Compose services with `restart: unless-stopped` will automatically start on boot.

Verify Docker starts on boot:

```bash
sudo systemctl enable docker
```

## Maintenance Commands

### View logs

```bash
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f web
```

### Restart services

```bash
docker compose -f docker-compose.prod.yml restart
docker compose -f docker-compose.prod.yml restart api
docker compose -f docker-compose.prod.yml restart web
```

### Update application

```bash
# Pull latest code (if using git)
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Stop services

```bash
docker compose -f docker-compose.prod.yml down
```

### Clean up unused Docker resources

```bash
docker system prune -a
```

## Monitoring

### Check container status

```bash
docker compose -f docker-compose.prod.yml ps
```

### Monitor resource usage

```bash
docker stats
```

### View container health

```bash
docker inspect --format='{{.State.Health.Status}}' rh-ads-api
docker inspect --format='{{.State.Health.Status}}' rh-ads-web
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs api
docker compose -f docker-compose.prod.yml logs web

# Check if ports are already in use
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :3000
```

### API connection issues

1. Check if API is running: `curl http://localhost:8000/health`
2. Check Docker network: `docker network ls`
3. Check environment variables: `docker compose -f docker-compose.prod.yml config`

### Out of disk space

```bash
# Check disk usage
df -h

# Clean up Docker resources
docker system prune -a
```

## Security Recommendations

1. **Keep system updated**: `sudo apt update && sudo apt upgrade -y`
2. **Use strong passwords** for all accounts
3. **Disable root SSH login** after setting up deployer user
4. **Use SSL/TLS** (Let's Encrypt) for production
5. **Regular backups** of your data directory
6. **Monitor logs** for suspicious activity
7. **Use secrets management** for sensitive environment variables
8. **Limit SSH access** to specific IP addresses if possible

## Backup Strategy

```bash
# Backup data directory
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Backup to remote location (e.g., DigitalOcean Spaces)
# Install s3cmd or use rclone for cloud backups
```

## Automated Deployment Script

Use the included `deploy.sh` script for automated deployments:

```bash
chmod +x deploy.sh
./deploy.sh <droplet-ip>
```
