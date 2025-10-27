# Quick Start: Deploy to DigitalOcean

This is a condensed guide for quickly deploying your application to DigitalOcean. For detailed instructions, see `DEPLOYMENT.md`.

## Prerequisites

- DigitalOcean account
- SSH key added to DigitalOcean
- OpenAI API key

## Quick Deploy Steps

### 1. Create a Droplet

Using DigitalOcean web console:
- Ubuntu 22.04 LTS
- Minimum 2GB RAM (Basic plan: $18/month)
- Choose your preferred region
- Add your SSH key
- Create droplet

Note your droplet's IP address.

### 2. Initial Server Setup

```bash
# SSH into your droplet
ssh root@<your-droplet-ip>

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Create deployer user
adduser deployer
usermod -aG sudo deployer
usermod -aG docker deployer
rsync --archive --chown=deployer:deployer ~/.ssh /home/deployer

# Switch to deployer user
su - deployer
```

### 3. Use Automated Deployment Script

On your **local machine**:

```bash
# Make deploy script executable (already done)
chmod +x deploy.sh

# Deploy to your droplet
./deploy.sh <your-droplet-ip> deployer
```

### 4. Configure Environment Variables

SSH into your droplet:

```bash
ssh deployer@<your-droplet-ip>
cd ~/rh-advertising
nano .env
```

Add your environment variables:

```env
OPENAI_API_KEY=sk-your-key-here
JINA_API_KEY=your-jina-key-here
CORS_ALLOW_ORIGINS=http://<your-droplet-ip>:3000,http://<your-droplet-ip>
NEXT_PUBLIC_APP_NAME=RH AI Assistant
```

Save and exit (Ctrl+X, Y, Enter)

### 5. Restart Services

```bash
docker compose -f docker-compose.prod.yml restart
```

### 6. Verify Deployment

```bash
# Check service status
docker compose -f docker-compose.prod.yml ps

# Check API health
curl http://localhost:8000/health

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

### 7. Set Up Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 8. Access Your Application

Open in browser: `http://<your-droplet-ip>:3000`

## Optional: Set Up Domain and SSL

### Install and Configure Nginx

```bash
sudo apt install nginx -y
sudo cp ~/rh-advertising/nginx.conf.example /etc/nginx/sites-available/rh-advertising
sudo nano /etc/nginx/sites-available/rh-advertising
# Replace 'your-domain.com' with your actual domain

sudo ln -s /etc/nginx/sites-available/rh-advertising /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Get SSL Certificate

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Update Environment Variables

Update CORS in `.env`:

```env
CORS_ALLOW_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

Restart services:

```bash
docker compose -f docker-compose.prod.yml restart
```

## Common Commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart all services
docker compose -f docker-compose.prod.yml restart

# Stop all services
docker compose -f docker-compose.prod.yml down

# Update and redeploy
git pull  # or use deploy.sh again
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Services won't start
```bash
docker compose -f docker-compose.prod.yml logs
```

### API connection issues
```bash
# Check if API is running
curl http://localhost:8000/health

# Check environment variables
docker compose -f docker-compose.prod.yml config
```

### Port already in use
```bash
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :3000
```

## Estimated Costs

- **Droplet**: $18/month (2GB Basic)
- **Domain**: $12/year (optional)
- **Total**: ~$18-19/month

## Next Steps

1. Set up automated backups
2. Configure monitoring
3. Set up CI/CD pipeline
4. Review security settings

For detailed information, see `DEPLOYMENT.md`.
