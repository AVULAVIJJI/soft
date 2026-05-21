#!/bin/bash
# Quick deployment script
set -e

echo "Starting Softmaster Platform deployment..."

cd /opt/softmaster

echo "Pulling latest code..."
git pull origin main

echo "Building and starting services..."
docker-compose down
docker-compose pull
docker-compose up -d --build

echo "Running database migrations..."
docker-compose exec backend alembic upgrade head

echo "Checking service health..."
sleep 10
docker-compose ps

echo ""
echo "Deployment complete."
echo "Platform is running at https://softmastertech.com"
