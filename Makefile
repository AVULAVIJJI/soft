.PHONY: help setup dev build deploy stop logs clean

help:
	@echo "Softmaster Platform Commands"
	@echo "============================"
	@echo "make setup      - Initial setup (copy .env, generate keys)"
	@echo "make dev        - Start development environment"
	@echo "make build      - Build all Docker images"
	@echo "make deploy     - Deploy to production"
	@echo "make stop       - Stop all containers"
	@echo "make logs       - View logs"
	@echo "make clean      - Remove all containers and volumes"
	@echo "make db-backup  - Backup database"
	@echo "make db-restore - Restore database"

setup:
	cp .env.example .env
	@echo "Edit .env with your values, then run: make dev"

dev:
	docker-compose up -d postgres redis
	@echo "Database ready. Starting backend..."
	cd backend && pip install -r requirements.txt && uvicorn main:app --reload

build:
	docker-compose build

deploy:
	docker-compose up -d --build
	@echo "All services deployed!"
	docker-compose ps

stop:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v --remove-orphans

db-backup:
	docker exec softmaster_postgres pg_dump -U softmaster softmaster_db > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup saved!"

db-restore:
	@read -p "Backup file path: " FILE; \
	docker exec -i softmaster_postgres psql -U softmaster softmaster_db < $$FILE

health:
	curl -s http://localhost:8000/health | python3 -m json.tool

test:
	cd backend && python -m pytest tests/ -v
