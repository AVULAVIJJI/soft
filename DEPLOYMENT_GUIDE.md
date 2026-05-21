# SOFTMASTER Enterprise Platform - Complete Deployment Guide
# Hostinger VPS Step-by-Step

## COMPANY INFORMATION
Name: Softmaster Technology Solutions Pvt Ltd
Address: No:07, George E De Silva Mawatha, Kandy 20000, Sri Lanka
Phone: +94 81 220 4130 | +94 76 593 3568
Email: info@softmastergroup.com

---

## PLATFORM OVERVIEW

Domain Structure:
  softmastertech.com              - Main corporate website
  academy.softmastertech.com      - Academy portal
  jobs.softmastertech.com         - Jobs portal
  client.softmastertech.com       - Client portal
  workspace.softmastertech.com    - ERP workspace
  admin.softmastertech.com        - Admin dashboard
  api.softmastertech.com          - Backend API

Tech Stack (All Free):
  Frontend:  Next.js 14 + TypeScript + Tailwind CSS + ShadCN UI
  Backend:   FastAPI (Python 3.11)
  Database:  PostgreSQL 15
  Auth:      JWT tokens
  Storage:   Cloudinary (free tier)
  Email:     Brevo (300 emails/day free)
  Payments:  Razorpay
  Container: Docker + Docker Compose
  Proxy:     Nginx

---

## STEP 1 - GET HOSTINGER VPS

1. Login to Hostinger (hostinger.com)
2. Go to VPS section
3. Choose VPS plan - minimum KVM 2 (2GB RAM, 2 vCPU, 40GB SSD)
4. Select Ubuntu 24.04 LTS as operating system
5. Choose server location nearest to Sri Lanka (Singapore recommended)
6. Complete purchase
7. Note your VPS IP address from the dashboard

---

## STEP 2 - SETUP DOMAIN DNS IN HOSTINGER

1. Login to Hostinger dashboard
2. Go to Domains section
3. Click your domain (softmastertech.com)
4. Go to DNS / Nameservers
5. Add these A records pointing to your VPS IP:

   Type  | Name        | Points to      | TTL
   ------|-------------|----------------|-----
   A     | @           | YOUR_VPS_IP    | 300
   A     | www         | YOUR_VPS_IP    | 300
   A     | academy     | YOUR_VPS_IP    | 300
   A     | jobs        | YOUR_VPS_IP    | 300
   A     | client      | YOUR_VPS_IP    | 300
   A     | workspace   | YOUR_VPS_IP    | 300
   A     | admin       | YOUR_VPS_IP    | 300
   A     | api         | YOUR_VPS_IP    | 300

6. Wait 1 to 24 hours for DNS propagation

---

## STEP 3 - CONNECT TO VPS AND INSTALL DEPENDENCIES

Open terminal (or use Hostinger's browser terminal):

  ssh root@YOUR_VPS_IP

Then run:

  apt-get update && apt-get upgrade -y

  # Install Docker
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  systemctl enable docker
  systemctl start docker

  # Install Docker Compose
  curl -L "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose

  # Install Git and Certbot
  apt-get install -y git certbot python3-certbot-nginx ufw

  # Setup firewall
  ufw allow 22
  ufw allow 80
  ufw allow 443
  ufw --force enable

Or run the automated script:
  bash deployment/scripts/hostinger-setup.sh

---

## STEP 4 - UPLOAD PROJECT FILES TO VPS

Option A - Using Git (Recommended):
  mkdir -p /opt/softmaster
  cd /opt/softmaster
  git init
  git remote add origin https://github.com/YOUR_USERNAME/softmaster-platform.git
  git pull origin main

Option B - Using SFTP (FileZilla):
  1. Download FileZilla: filezilla-project.org
  2. Connect: Host=YOUR_VPS_IP, Username=root, Password=VPS_PASSWORD, Port=22
  3. Upload the SOFTMASTER folder to /opt/softmaster/

---

## STEP 5 - CONFIGURE ENVIRONMENT VARIABLES

  cd /opt/softmaster
  cp .env.example .env
  nano .env

Fill in ALL values:
  DATABASE_URL=postgresql://softmaster_user:STRONG_PASSWORD@localhost:5432/softmaster_db
  DB_PASSWORD=STRONG_PASSWORD_HERE
  JWT_SECRET=VERY_LONG_RANDOM_STRING_64_CHARS_MINIMUM
  
  # Cloudinary (free at cloudinary.com):
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  
  # Brevo email (free at brevo.com):
  BREVO_API_KEY=your_brevo_api_key
  SMTP_HOST=smtp-relay.brevo.com
  SMTP_USER=your_email@domain.com
  SMTP_PASSWORD=your_smtp_password
  
  # Razorpay (razorpay.com):
  RAZORPAY_KEY_ID=your_key_id
  RAZORPAY_KEY_SECRET=your_key_secret
  
  APP_URL=https://softmastertech.com
  API_URL=https://api.softmastertech.com
  NEXT_PUBLIC_API_URL=https://api.softmastertech.com
  
  SUPER_ADMIN_EMAIL=admin@softmastertech.com
  SUPER_ADMIN_PASSWORD=CHANGE_THIS_STRONG_PASSWORD

Save with Ctrl+X, then Y, then Enter.

---

## STEP 6 - SETUP SSL CERTIFICATES

Make sure DNS has propagated first (test: ping softmastertech.com should show your VPS IP).

  # Get wildcard certificate for all subdomains
  certbot certonly --standalone -d softmastertech.com -d www.softmastertech.com \
    -d academy.softmastertech.com -d jobs.softmastertech.com \
    -d client.softmastertech.com -d workspace.softmastertech.com \
    -d admin.softmastertech.com -d api.softmastertech.com

  # Copy certificates to deployment folder
  mkdir -p /opt/softmaster/deployment/ssl
  cp /etc/letsencrypt/live/softmastertech.com/fullchain.pem /opt/softmaster/deployment/ssl/softmastertech.com.crt
  cp /etc/letsencrypt/live/softmastertech.com/privkey.pem /opt/softmaster/deployment/ssl/softmastertech.com.key

  # Auto-renew SSL (add to crontab)
  echo "0 12 * * * certbot renew --quiet" | crontab -

---

## STEP 7 - BUILD AND START ALL SERVICES

  cd /opt/softmaster
  
  # Build all Docker images and start
  docker-compose up -d --build
  
  # Check all services are running
  docker-compose ps
  
  # View logs if any service fails
  docker-compose logs backend
  docker-compose logs website
  docker-compose logs nginx

Expected output - all services should show "Up":
  softmaster_db        Up
  softmaster_redis     Up
  softmaster_backend   Up
  softmaster_website   Up
  softmaster_academy   Up
  softmaster_jobs      Up
  softmaster_admin     Up
  softmaster_client    Up
  softmaster_workspace Up
  softmaster_nginx     Up

---

## STEP 8 - VERIFY EVERYTHING IS WORKING

Test each URL in your browser:
  https://softmastertech.com              - Shows corporate website
  https://academy.softmastertech.com      - Shows academy portal
  https://jobs.softmastertech.com         - Shows jobs portal
  https://admin.softmastertech.com        - Shows admin login
  https://client.softmastertech.com       - Shows client portal
  https://workspace.softmastertech.com    - Shows ERP workspace
  https://api.softmastertech.com/docs     - Shows API documentation
  https://api.softmastertech.com/health   - Returns {"status":"healthy"}

---

## STEP 9 - SETUP AUTOMATED BACKUPS

  # Daily database backup at 2 AM
  echo "0 2 * * * /opt/softmaster/deployment/scripts/backup.sh" | crontab -
  
  # Run backup manually to test
  bash /opt/softmaster/deployment/scripts/backup.sh

---

## STEP 10 - SETUP GITHUB ACTIONS FOR AUTO DEPLOYMENT

1. Create GitHub repository
2. Push your code: git push origin main
3. In GitHub repository, go to Settings > Secrets > Actions
4. Add these secrets:
   VPS_HOST = YOUR_VPS_IP
   VPS_USER = root
   VPS_SSH_KEY = (paste content of your SSH private key)
   NEXT_PUBLIC_API_URL = https://api.softmastertech.com

5. Now every git push to main branch auto-deploys to VPS.

---

## FREE SERVICES REGISTRATION (Do These First)

1. CLOUDINARY (file storage)
   - Go to cloudinary.com
   - Click Sign Up Free
   - Free tier: 25GB storage, 25GB bandwidth/month
   - Copy your Cloud Name, API Key, API Secret to .env

2. BREVO (email)
   - Go to brevo.com
   - Click Sign Up Free
   - Free tier: 300 emails/day, unlimited contacts
   - Go to SMTP & API > SMTP
   - Copy SMTP credentials to .env

3. RAZORPAY (payments)
   - Go to razorpay.com
   - Create account
   - International payments available for Sri Lanka
   - Go to Settings > API Keys
   - Copy Key ID and Secret to .env

4. GROQ (AI chatbot - optional)
   - Go to groq.com
   - Sign up free
   - Get API key
   - Free tier: 14,400 requests/day
   - Add GROQ_API_KEY to .env

---

## MONITORING YOUR PLATFORM

# View real-time logs
docker-compose logs -f backend
docker-compose logs -f nginx

# Check disk space
df -h

# Check memory usage
free -h

# Restart a specific service
docker-compose restart backend

# Restart everything
docker-compose down && docker-compose up -d

# View all containers
docker-compose ps

---

## COMMON TROUBLESHOOTING

Problem: Website shows 502 Bad Gateway
Solution: 
  docker-compose logs nginx
  docker-compose restart backend
  docker-compose restart nginx

Problem: Database connection failed
Solution:
  docker-compose logs postgres
  docker-compose restart postgres
  docker-compose restart backend

Problem: SSL certificate error
Solution:
  certbot renew --force-renewal
  docker-compose restart nginx

Problem: Out of memory
Solution:
  Free up memory: docker system prune -f
  Or upgrade your Hostinger VPS plan

---

## UPDATING THE PLATFORM

To update to a new version:
  cd /opt/softmaster
  git pull origin main
  docker-compose up -d --build
  docker-compose exec backend alembic upgrade head

Or use the automated script:
  bash deployment/scripts/deploy.sh

---

## PLATFORM ARCHITECTURE

User Browser
     |
     v
Nginx (Port 80/443)
     |
     +-- softmastertech.com -------> website (Port 3000)
     +-- academy.* ----------------> academy (Port 3001)
     +-- jobs.* -------------------> jobs (Port 3002)
     +-- admin.* ------------------> admin (Port 3003)
     +-- client.* -----------------> client (Port 3004)
     +-- workspace.* --------------> workspace (Port 3005)
     +-- api.* --------------------> backend FastAPI (Port 8000)
                                          |
                                     PostgreSQL (Port 5432)
                                     Redis (Port 6379)

---

## SUPPORT CONTACTS

Company:  Softmaster Technology Solutions Pvt Ltd
Address:  No:07, George E De Silva Mawatha, Kandy 20000, Sri Lanka
Phone:    +94 81 220 4130 | +94 76 593 3568
Email:    info@softmastergroup.com
Website:  softmastertech.com

---

Document: Softmaster Enterprise Platform Deployment Guide
Version: 1.0.0
