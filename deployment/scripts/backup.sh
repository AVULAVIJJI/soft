#!/bin/bash
# Database backup script - run daily via cron
BACKUP_DIR="/opt/softmaster/database/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

docker-compose exec -T postgres pg_dump -U softmaster_user softmaster_db \
  | gzip > "$BACKUP_DIR/softmaster_$DATE.sql.gz"

# Keep only last 30 backups
ls -t "$BACKUP_DIR"/*.sql.gz | tail -n +31 | xargs rm -f 2>/dev/null || true
echo "Backup completed: softmaster_$DATE.sql.gz"
