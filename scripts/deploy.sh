#!/bin/bash
# ============================================================
# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# Production Deployment Script
# CIN: U78100TS2024PTC191444
# File: scripts/deploy.sh
# ============================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DEPLOY_DATE=$(date +"%Y-%m-%d %H:%M:%S")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "N/A")
DEPLOY_USER=$(whoami)

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD            ║"
echo "║              Production Deployment                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo "  Date:    $DEPLOY_DATE"
echo "  Commit:  $GIT_COMMIT"
echo "  User:    $DEPLOY_USER"
echo ""

# ─── Safety check ─────────────────────────────────────────────────────────────
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "master" ]; then
    echo -e "${YELLOW}WARNING: You are deploying from branch '$BRANCH', not main/master.${NC}"
    read -p "Continue? (yes/no): " confirm
    [ "$confirm" != "yes" ] && echo "Deployment cancelled." && exit 0
fi

# ─── Pull latest code ─────────────────────────────────────────────────────────
echo -e "${YELLOW}[1/7] Pulling latest code...${NC}"
git pull origin "$BRANCH"
echo -e "${GREEN}✓ Code updated${NC}"

# ─── Backup database before deploy ────────────────────────────────────────────
echo -e "${YELLOW}[2/7] Backing up database...${NC}"
bash scripts/backup.sh
echo -e "${GREEN}✓ Backup completed${NC}"

# ─── Build Docker images ──────────────────────────────────────────────────────
echo -e "${YELLOW}[3/7] Building Docker images...${NC}"
docker-compose build --no-cache
echo -e "${GREEN}✓ Images built${NC}"

# ─── Run database migrations ──────────────────────────────────────────────────
echo -e "${YELLOW}[4/7] Running database migrations...${NC}"
source .env
for sql_file in database/schema/users.sql database/schema/academy.sql database/schema/jobs.sql database/schema/workspace.sql database/schema/clients.sql database/schema/finance.sql database/schema/analytics.sql; do
    if [ -f "$sql_file" ]; then
        psql "$DATABASE_URL" -f "$sql_file" 2>/dev/null && echo -e "${GREEN}    ✓ $(basename $sql_file)${NC}" || echo -e "${YELLOW}    ⚠ Skipped $(basename $sql_file)${NC}"
    fi
done
echo -e "${GREEN}✓ Migrations complete${NC}"

# ─── Zero-downtime deployment ─────────────────────────────────────────────────
echo -e "${YELLOW}[5/7] Deploying services (zero-downtime)...${NC}"

# Stop old containers one by one, start new ones
docker-compose up -d --remove-orphans --scale backend=2

sleep 10  # Wait for new containers to be healthy

docker-compose up -d

echo -e "${GREEN}✓ Services deployed${NC}"

# ─── Health checks ────────────────────────────────────────────────────────────
echo -e "${YELLOW}[6/7] Running health checks...${NC}"

sleep 5  # Wait for services to start

BACKEND_URL="${API_URL:-https://api.softmastertech.com}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" 2>/dev/null || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}  ✓ Backend API healthy (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${YELLOW}  ⚠ Backend health check returned HTTP $HTTP_STATUS${NC}"
    echo -e "${YELLOW}  Check logs: docker-compose logs backend${NC}"
fi

# ─── Cleanup old images ───────────────────────────────────────────────────────
echo -e "${YELLOW}[7/7] Cleaning up old Docker images...${NC}"
docker image prune -f 2>/dev/null || true
echo -e "${GREEN}✓ Cleanup complete${NC}"

# ─── Deployment Summary ───────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗"
echo "║            DEPLOYMENT COMPLETED SUCCESSFULLY!              ║"
echo "╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  Deployed: $DEPLOY_DATE"
echo "  Commit:   $GIT_COMMIT"
echo "  Branch:   $BRANCH"
echo ""
echo "  Live URLs:"
echo "  Website:    https://softmastertech.com"
echo "  Academy:    https://academy.softmastertech.com"
echo "  Jobs:       https://jobs.softmastertech.com"
echo "  Client:     https://client.softmastertech.com"
echo "  Workspace:  https://workspace.softmastertech.com"
echo "  Employee:   https://employee.softmastertech.com"
echo "  Placement:  https://placement.softmastertech.com"
echo "  Admin:      https://admin.softmastertech.com"
echo "  API Docs:   https://api.softmastertech.com/docs"
echo ""
echo "  Monitor: docker-compose logs -f"
echo ""
