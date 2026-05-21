#!/bin/bash
# ============================================================
# Softmaster Enterprise Platform - Hostinger VPS Setup Script
# Run as root on your Hostinger VPS: bash hostinger-setup.sh
# ============================================================

set -e

echo "=============================================="
echo "Softmaster Enterprise Platform - VPS Setup"
echo "=============================================="

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git and Certbot (for SSL)
apt-get install -y git certbot python3-certbot-nginx ufw

# Setup firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Create project directory
mkdir -p /opt/softmaster
cd /opt/softmaster

# Clone your repository (replace with your actual repo URL)
# git clone https://github.com/your-username/softmaster-platform.git .

echo ""
echo "Docker and Docker Compose installed successfully."
echo ""
echo "NEXT STEPS:"
echo "1. Upload your project files to /opt/softmaster/"
echo "2. Copy .env.example to .env and fill in values: cp .env.example .env"
echo "3. Run: docker-compose up -d"
echo "4. Setup SSL: certbot --nginx -d softmastertech.com -d www.softmastertech.com"
echo ""
echo "Your VPS is ready for deployment."
