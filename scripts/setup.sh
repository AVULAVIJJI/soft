#!/bin/bash
# ============================================================
# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# Complete Platform Setup Script
# CIN: U78100TS2024PTC191444
# File: scripts/setup.sh
# ============================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD            ║"
echo "║           Complete SaaS Platform Setup                    ║"
echo "║          CIN: U78100TS2024PTC191444                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ─── Check prerequisites ─────────────────────────────────────────────────────

echo -e "${YELLOW}[1/8] Checking prerequisites...${NC}"

command -v docker >/dev/null 2>&1 || { echo -e "${RED}ERROR: Docker is required but not installed.${NC}"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || command -v docker >/dev/null 2>&1 || { echo -e "${RED}ERROR: Docker Compose is required.${NC}"; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}ERROR: Node.js 20+ is required.${NC}"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}ERROR: Python 3.11+ is required.${NC}"; exit 1; }

echo -e "${GREEN}✓ All prerequisites satisfied${NC}"

# ─── Environment setup ────────────────────────────────────────────────────────

echo -e "${YELLOW}[2/8] Setting up environment variables...${NC}"

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}  ⚠ .env created from .env.example${NC}"
    echo -e "${YELLOW}  ⚠ IMPORTANT: Edit .env with your real credentials before proceeding!${NC}"
    echo ""
    echo -e "${RED}  Required credentials to configure:${NC}"
    echo "    - DATABASE_URL (PostgreSQL connection)"
    echo "    - SECRET_KEY (generate with: python3 -c 'import secrets; print(secrets.token_hex(32))')"
    echo "    - RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET"
    echo "    - BREVO_API_KEY (email service)"
    echo "    - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
    echo "    - REDIS_URL"
    echo ""
    read -p "Have you configured .env with real credentials? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}Please configure .env and run this script again.${NC}"
        exit 0
    fi
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

# ─── Generate secret key if not set ──────────────────────────────────────────

if grep -q "your-secret-key-here" .env; then
    SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    sed -i "s/your-secret-key-here/$SECRET/" .env
    echo -e "${GREEN}✓ Generated secure SECRET_KEY${NC}"
fi

# ─── Database setup ───────────────────────────────────────────────────────────

echo -e "${YELLOW}[3/8] Setting up database...${NC}"

source .env

if command -v psql >/dev/null 2>&1; then
    psql "$DATABASE_URL" -c "SELECT 1" >/dev/null 2>&1 && echo -e "${GREEN}✓ Database connection successful${NC}" || {
        echo -e "${YELLOW}  Creating database...${NC}"
        createdb softmaster_db 2>/dev/null || true
    }
fi

echo -e "${YELLOW}  Running database schema migrations...${NC}"
for sql_file in database/schema/users.sql database/schema/academy.sql database/schema/jobs.sql database/schema/workspace.sql database/schema/clients.sql database/schema/finance.sql database/schema/analytics.sql; do
    if [ -f "$sql_file" ]; then
        psql "$DATABASE_URL" -f "$sql_file" >/dev/null 2>&1 && echo -e "${GREEN}    ✓ $(basename $sql_file)${NC}" || echo -e "${YELLOW}    ⚠ Skipped $(basename $sql_file) (may already exist)${NC}"
    fi
done

echo -e "${YELLOW}  Loading seed data...${NC}"
psql "$DATABASE_URL" -f database/seeds/initial_data.sql >/dev/null 2>&1 && echo -e "${GREEN}  ✓ Seed data loaded${NC}" || echo -e "${YELLOW}  ⚠ Seed data skipped (may already exist)${NC}"

# ─── Backend setup ────────────────────────────────────────────────────────────

echo -e "${YELLOW}[4/8] Setting up backend...${NC}"

cd backend
python3 -m venv venv 2>/dev/null || true
source venv/bin/activate
pip install -r requirements.txt -q
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
cd ..

# ─── Frontend setup ───────────────────────────────────────────────────────────

echo -e "${YELLOW}[5/8] Setting up all frontend portals...${NC}"

APPS=("website" "academy" "jobs" "client" "workspace" "employee" "placement" "admin")
for app in "${APPS[@]}"; do
    if [ -d "frontend/apps/$app" ]; then
        cd "frontend/apps/$app"
        npm install --silent 2>/dev/null && echo -e "${GREEN}  ✓ $app portal dependencies installed${NC}" || echo -e "${YELLOW}  ⚠ $app install had warnings${NC}"
        cd "../../.."
    fi
done

# ─── Docker build ─────────────────────────────────────────────────────────────

echo -e "${YELLOW}[6/8] Building Docker images...${NC}"
docker-compose build --quiet 2>/dev/null && echo -e "${GREEN}✓ Docker images built${NC}" || echo -e "${YELLOW}⚠ Docker build skipped (check Docker setup)${NC}"

# ─── SSL setup (optional) ─────────────────────────────────────────────────────

echo -e "${YELLOW}[7/8] SSL setup...${NC}"

if command -v certbot >/dev/null 2>&1; then
    echo "  Certbot found. For production SSL run:"
    echo "  certbot --nginx -d softmastertech.com -d www.softmastertech.com"
    echo "  certbot --nginx -d academy.softmastertech.com"
    echo "  certbot --nginx -d jobs.softmastertech.com"
    echo "  certbot --nginx -d client.softmastertech.com"
    echo "  certbot --nginx -d workspace.softmastertech.com"
    echo "  certbot --nginx -d employee.softmastertech.com"
    echo "  certbot --nginx -d placement.softmastertech.com"
    echo "  certbot --nginx -d admin.softmastertech.com"
    echo "  certbot --nginx -d api.softmastertech.com"
else
    echo -e "${YELLOW}  ⚠ Certbot not found. Install for SSL: sudo apt install certbot python3-certbot-nginx${NC}"
fi

# ─── Summary ─────────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}[8/8] Setup Summary${NC}"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗"
echo "║              SETUP COMPLETED SUCCESSFULLY!                 ║"
echo "╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  Next Steps:"
echo "  1. Start all services:       docker-compose up -d"
echo "  2. View logs:                docker-compose logs -f"
echo "  3. Access admin portal:      https://admin.softmastertech.com"
echo "  4. Default admin login:      admin@softmastertech.com"
echo "  5. Change default password immediately after first login!"
echo ""
echo "  Portal URLs:"
echo "  Website:    https://softmastertech.com"
echo "  Academy:    https://academy.softmastertech.com"
echo "  Jobs:       https://jobs.softmastertech.com"
echo "  Client:     https://client.softmastertech.com"
echo "  Workspace:  https://workspace.softmastertech.com"
echo "  Employee:   https://employee.softmastertech.com"
echo "  Placement:  https://placement.softmastertech.com"
echo "  Admin:      https://admin.softmastertech.com"
echo "  API:        https://api.softmastertech.com/docs"
echo ""
echo -e "  ${YELLOW}Softmaster Technology Solutions Pvt Ltd${NC}"
echo -e "  ${YELLOW}CIN: U78100TS2024PTC191444${NC}"
echo ""
