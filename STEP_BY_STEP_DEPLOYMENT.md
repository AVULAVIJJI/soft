# SOFTMASTER ENTERPRISE PLATFORM - COMPLETE DEPLOYMENT GUIDE
# For Hostinger VPS with Custom Domain

---

## PREREQUISITES

1. Hostinger VPS (Ubuntu 22.04 recommended, minimum 4GB RAM, 2 vCPU, 80GB SSD)
2. Domain: softmastertech.com (pointed to your VPS IP in Hostinger DNS)
3. SSH access to your server

---

## STEP 1 — CONNECT TO YOUR VPS

Open terminal and run:

```bash
ssh root@YOUR_VPS_IP
```

---

## STEP 2 — UPDATE SERVER AND INSTALL DEPENDENCIES

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install essential tools
apt-get install -y curl git wget unzip nginx certbot python3-certbot-nginx

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install Python 3.11
apt-get install -y python3.11 python3.11-venv python3-pip

# Verify installations
docker --version
docker-compose --version
node --version
npm --version
python3 --version
```

---

## STEP 3 — UPLOAD YOUR PROJECT TO SERVER

From your local computer:
```bash
# Option A: Using SCP
scp -r SOFTMASTER/ root@YOUR_VPS_IP:/opt/softmaster/

# Option B: Using Git (recommended)
# First push to GitHub, then on server:
cd /opt
git clone https://github.com/YOUR_USERNAME/softmaster.git softmaster

cd /opt/softmaster
```

---

## STEP 4 — CONFIGURE ENVIRONMENT VARIABLES

```bash
cd /opt/softmaster
cp .env.example .env
nano .env
```

Fill in all values in .env:
```
DATABASE_URL=postgresql://softmaster:YOUR_STRONG_PASSWORD@localhost:5432/softmasterdb
JWT_SECRET=GENERATE_WITH: openssl rand -hex 64
REDIS_URL=redis://localhost:6379

# Cloudinary (free at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Brevo email (free at brevo.com - 300 emails/day)
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=noreply@softmastertech.com

# Razorpay (payments)
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# Groq AI (free at console.groq.com)
GROQ_API_KEY=your_groq_key

# App URLs
NEXT_PUBLIC_API_URL=https://api.softmastertech.com
NEXT_PUBLIC_APP_URL=https://softmastertech.com

# CORS
ALLOWED_ORIGINS=https://softmastertech.com,https://academy.softmastertech.com,https://jobs.softmastertech.com,https://client.softmastertech.com,https://workspace.softmastertech.com,https://admin.softmastertech.com
```

---

## STEP 5 — CONFIGURE DNS IN HOSTINGER

Go to Hostinger panel → DNS → Add these A records (replace with your VPS IP):

```
@           A    YOUR_VPS_IP    (softmastertech.com)
www         A    YOUR_VPS_IP
api         A    YOUR_VPS_IP
academy     A    YOUR_VPS_IP
jobs        A    YOUR_VPS_IP
client      A    YOUR_VPS_IP
workspace   A    YOUR_VPS_IP
admin       A    YOUR_VPS_IP
employee    A    YOUR_VPS_IP
placement   A    YOUR_VPS_IP
```

Wait 10-30 minutes for DNS propagation.

---

## STEP 6 — BUILD AND START WITH DOCKER

```bash
cd /opt/softmaster

# Build all containers
docker-compose build

# Start everything
docker-compose up -d

# Check all services are running
docker-compose ps

# View logs if any issues
docker-compose logs -f backend
docker-compose logs -f postgres
```

---

## STEP 7 — INITIALIZE DATABASE

```bash
# Run database migrations
docker-compose exec backend python -c "from app.core.database import engine; from app.models import *; Base.metadata.create_all(engine)"

# Or run SQL schema files
docker-compose exec postgres psql -U softmaster -d softmasterdb -f /docker-entrypoint-initdb.d/01_users.sql

# Create first super admin
docker-compose exec backend python -c "
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
db = SessionLocal()
admin = User(email='admin@softmastertech.com', full_name='Super Admin', role='super_admin', hashed_password=get_password_hash('Admin@123'), is_active=True, is_verified=True)
db.add(admin)
db.commit()
print('Admin created: admin@softmastertech.com / Admin@123')
"
```

---

## STEP 8 — INSTALL SSL CERTIFICATES (HTTPS)

```bash
# Get SSL for all subdomains
certbot --nginx -d softmastertech.com -d www.softmastertech.com -d api.softmastertech.com -d academy.softmastertech.com -d jobs.softmastertech.com -d client.softmastertech.com -d workspace.softmastertech.com -d admin.softmastertech.com -d employee.softmastertech.com -d placement.softmastertech.com

# Follow the prompts, enter email, agree to terms
# Select option to redirect HTTP to HTTPS (option 2)

# Auto-renew SSL (runs every 12h)
echo "0 12 * * * root certbot renew --quiet" | tee -a /etc/cron.d/certbot-renew
```

---

## STEP 9 — CONFIGURE NGINX

```bash
# Copy nginx config
cp /opt/softmaster/deployment/nginx/nginx.conf /etc/nginx/nginx.conf
cp /opt/softmaster/deployment/nginx/sites/*.conf /etc/nginx/sites-available/

# Enable sites
ln -s /etc/nginx/sites-available/main-website.conf /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/api.conf /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/subdomains.conf /etc/nginx/sites-enabled/

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx
```

---

## STEP 10 — BUILD FRONTEND APPS

```bash
cd /opt/softmaster/frontend/apps

# Build each app
for app in website academy jobs client workspace employee placement admin; do
  echo "Building $app..."
  cd /opt/softmaster/frontend/apps/$app
  npm install
  npm run build
done
```

---

## STEP 11 — SET UP AUTOMATIC BACKUPS

```bash
# Make backup script executable
chmod +x /opt/softmaster/scripts/backup.sh

# Add to cron (runs daily at 2am)
echo "0 2 * * * root /opt/softmaster/scripts/backup.sh" | tee -a /etc/cron.d/softmaster-backup

# Test backup manually
/opt/softmaster/scripts/backup.sh
```

---

## STEP 12 — VERIFY EVERYTHING IS WORKING

Check these URLs in your browser:

- https://softmastertech.com — Main website
- https://api.softmastertech.com/docs — API documentation
- https://api.softmastertech.com/health — API health check
- https://academy.softmastertech.com — Academy portal
- https://jobs.softmastertech.com — Jobs portal
- https://client.softmastertech.com — Client portal
- https://workspace.softmastertech.com — ERP workspace
- https://admin.softmastertech.com — Admin dashboard

---

## STEP 13 — CONFIGURE FREE SERVICES

### Cloudinary (File Storage)
1. Sign up at cloudinary.com (free tier: 25GB storage, 25GB bandwidth)
2. Get credentials from Dashboard → Account Details
3. Add to .env file

### Brevo (Email Service)
1. Sign up at brevo.com (free: 300 emails/day)
2. Go to SMTP & API → API Keys → Create new key
3. Add to .env file

### Groq AI (AI Services)
1. Sign up at console.groq.com (free: 14,400 requests/day)
2. Create API key
3. Add to .env file

### Google Analytics
1. Go to analytics.google.com
2. Create property for softmastertech.com
3. Get Measurement ID (G-XXXXXXXX)
4. Add to website layout.tsx

---

## MONITORING AND MAINTENANCE

```bash
# View all running containers
docker-compose ps

# View backend logs live
docker-compose logs -f backend

# Restart a specific service
docker-compose restart backend

# Update and redeploy
git pull
docker-compose build
docker-compose up -d

# Check disk usage
df -h

# Check memory
free -h

# Check nginx status
systemctl status nginx
```

---

## TROUBLESHOOTING

**API not responding:**
```bash
docker-compose logs backend
docker-compose restart backend
```

**Database connection error:**
```bash
docker-compose logs postgres
docker-compose restart postgres
```

**Nginx 502 error:**
```bash
nginx -t
systemctl status nginx
docker-compose ps
```

**SSL certificate issues:**
```bash
certbot renew
systemctl reload nginx
```

**Out of memory:**
```bash
free -h
docker system prune -f
```

---

## DEFAULT LOGIN CREDENTIALS

After running Step 7:
- Admin Panel: https://admin.softmastertech.com
- Email: admin@softmastertech.com
- Password: Admin@123

**IMPORTANT: Change this password immediately after first login.**

---

## SUPPORT

Company: Softmaster Technology Solutions Pvt Ltd
Address: No:07, George E De Silva Mawatha, Kandy 20000, Sri Lanka
Phone: +94 81 220 4130
Email: info@softmastergroup.com
