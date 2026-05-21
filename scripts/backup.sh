#!/bin/bash
# ============================================================
# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# Automated Database Backup Script
# CIN: U78100TS2024PTC191444
# File: scripts/backup.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ─── Configuration ────────────────────────────────────────────────────────────
BACKUP_DIR="${BACKUP_DIR:-/var/backups/softmaster}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="${DB_NAME:-softmaster_db}"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"
STORAGE_TYPE="${BACKUP_STORAGE:-local}"   # local | s3 | cloudinary

echo -e "${YELLOW}Starting Softmaster database backup...${NC}"
echo "  Timestamp: $TIMESTAMP"
echo "  Database:  $DB_NAME"
echo "  Output:    $BACKUP_FILE"
echo ""

# ─── Load environment ─────────────────────────────────────────────────────────
if [ -f .env ]; then
    source .env
fi

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}ERROR: DATABASE_URL not set. Check your .env file.${NC}"
    exit 1
fi

# ─── Create backup directory ──────────────────────────────────────────────────
mkdir -p "$BACKUP_DIR"

# ─── Perform backup ───────────────────────────────────────────────────────────
echo -e "${YELLOW}[1/4] Creating database dump...${NC}"
pg_dump "$DATABASE_URL" \
    --format=plain \
    --no-owner \
    --no-privileges \
    --if-exists \
    --clean \
    | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓ Backup created: $BACKUP_FILE ($BACKUP_SIZE)${NC}"
else
    echo -e "${RED}ERROR: pg_dump failed!${NC}"
    exit 1
fi

# ─── Upload to remote storage (optional) ─────────────────────────────────────

echo -e "${YELLOW}[2/4] Uploading to remote storage...${NC}"

if [ "$STORAGE_TYPE" = "s3" ] && command -v aws >/dev/null 2>&1; then
    S3_BUCKET="${AWS_BACKUP_BUCKET:-softmaster-backups}"
    S3_KEY="database/${DB_NAME}/${TIMESTAMP}.sql.gz"
    aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/$S3_KEY" \
        --storage-class STANDARD_IA \
        --server-side-encryption AES256 \
        2>/dev/null && echo -e "${GREEN}  ✓ Uploaded to S3: s3://$S3_BUCKET/$S3_KEY${NC}" || echo -e "${YELLOW}  ⚠ S3 upload failed (local backup retained)${NC}"
elif [ "$STORAGE_TYPE" = "gcs" ] && command -v gsutil >/dev/null 2>&1; then
    GCS_BUCKET="${GCS_BACKUP_BUCKET:-softmaster-backups}"
    gsutil cp "$BACKUP_FILE" "gs://$GCS_BUCKET/database/${TIMESTAMP}.sql.gz" \
        2>/dev/null && echo -e "${GREEN}  ✓ Uploaded to GCS${NC}" || echo -e "${YELLOW}  ⚠ GCS upload failed (local backup retained)${NC}"
else
    echo -e "${YELLOW}  ⚠ Remote storage not configured. Backup stored locally only.${NC}"
    echo "  To enable S3: set BACKUP_STORAGE=s3 and AWS_BACKUP_BUCKET in .env"
fi

# ─── Verify backup integrity ──────────────────────────────────────────────────
echo -e "${YELLOW}[3/4] Verifying backup integrity...${NC}"
if gzip -t "$BACKUP_FILE" 2>/dev/null; then
    echo -e "${GREEN}✓ Backup file integrity verified${NC}"
else
    echo -e "${RED}ERROR: Backup file is corrupted!${NC}"
    exit 1
fi

# ─── Cleanup old backups ──────────────────────────────────────────────────────
echo -e "${YELLOW}[4/4] Removing backups older than ${RETENTION_DAYS} days...${NC}"
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null && echo -e "${GREEN}✓ Old backups cleaned up${NC}" || true

# ─── Backup manifest ─────────────────────────────────────────────────────────
MANIFEST_FILE="$BACKUP_DIR/backup_manifest.log"
echo "$TIMESTAMP | $BACKUP_FILE | $BACKUP_SIZE | SUCCESS" >> "$MANIFEST_FILE"

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗"
echo "║       BACKUP COMPLETED SUCCESSFULLY!    ║"
echo "╚══════════════════════════════════════════╝${NC}"
echo ""
echo "  File:      $BACKUP_FILE"
echo "  Size:      $BACKUP_SIZE"
echo "  Timestamp: $TIMESTAMP"
echo "  Retention: $RETENTION_DAYS days"
echo ""

# List recent backups
echo "  Recent backups in $BACKUP_DIR:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null | tail -5 | awk '{print "  " $NF " (" $5 ")"}' || echo "  None found"
echo ""

# ─── Cron setup reminder ──────────────────────────────────────────────────────
echo "  To schedule daily backups at 2 AM, run:"
echo "  crontab -e"
echo "  Then add: 0 2 * * * cd /var/www/softmaster && bash scripts/backup.sh >> /var/log/softmaster-backup.log 2>&1"
echo ""
