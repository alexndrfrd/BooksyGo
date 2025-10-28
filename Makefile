.PHONY: help setup start stop clean build test deploy

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
RESET := \033[0m

help: ## Show this help message
	@echo '$(BLUE)BooksyGo - Available Commands:$(RESET)'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

setup: ## Initial setup - install dependencies and setup environment
	@echo "$(BLUE)Setting up BooksyGo...$(RESET)"
	@cp env.example .env
	@echo "✓ Environment file created (.env)"
	@docker-compose up -d postgres redis elasticsearch rabbitmq
	@echo "✓ Infrastructure services started"
	@echo "$(GREEN)Setup complete! Edit .env with your API keys$(RESET)"

start: ## Start all services (infrastructure + application)
	@echo "$(BLUE)Starting all services...$(RESET)"
	@docker-compose up -d
	@echo "$(GREEN)All services started!$(RESET)"
	@echo "Frontend: http://localhost:3000"
	@echo "API Gateway: http://localhost:4000"
	@echo "Grafana: http://localhost:3001"
	@echo "RabbitMQ: http://localhost:15672"
	@echo "Mailhog: http://localhost:8025"

stop: ## Stop all services
	@echo "$(BLUE)Stopping all services...$(RESET)"
	@docker-compose stop
	@echo "$(GREEN)All services stopped$(RESET)"

restart: stop start ## Restart all services

clean: ## Clean up containers, volumes, and generated files
	@echo "$(BLUE)Cleaning up...$(RESET)"
	@docker-compose down -v
	@rm -rf node_modules dist build .next
	@echo "$(GREEN)Cleanup complete$(RESET)"

build: ## Build all Docker images
	@echo "$(BLUE)Building Docker images...$(RESET)"
	@docker-compose build
	@echo "$(GREEN)Build complete$(RESET)"

logs: ## Show logs from all services
	@docker-compose logs -f

logs-service: ## Show logs from specific service (usage: make logs-service SERVICE=postgres)
	@docker-compose logs -f $(SERVICE)

test: ## Run tests for all services
	@echo "$(BLUE)Running tests...$(RESET)"
	@cd frontend && npm test
	@cd services/user-service && npm test
	@cd services/search-service && pytest
	@echo "$(GREEN)Tests complete$(RESET)"

lint: ## Run linters
	@echo "$(BLUE)Running linters...$(RESET)"
	@cd frontend && npm run lint
	@cd services/user-service && npm run lint
	@echo "$(GREEN)Linting complete$(RESET)"

migrate: ## Run database migrations
	@echo "$(BLUE)Running migrations...$(RESET)"
	@cd services/user-service && npm run migrate
	@echo "$(GREEN)Migrations complete$(RESET)"

seed: ## Seed database with sample data
	@echo "$(BLUE)Seeding database...$(RESET)"
	@cd services/user-service && npm run seed
	@echo "$(GREEN)Seeding complete$(RESET)"

dev-frontend: ## Start frontend in development mode
	@cd frontend && npm run dev

dev-backend: ## Start all backend services in development mode
	@echo "Starting all backend services..."
	@concurrently \
		"cd services/api-gateway && npm run dev" \
		"cd services/user-service && npm run dev" \
		"cd services/booking-service && npm run dev"

k8s-apply: ## Apply Kubernetes manifests
	@echo "$(BLUE)Applying Kubernetes manifests...$(RESET)"
	@kubectl apply -f infrastructure/k8s/
	@echo "$(GREEN)Manifests applied$(RESET)"

k8s-delete: ## Delete Kubernetes resources
	@echo "$(BLUE)Deleting Kubernetes resources...$(RESET)"
	@kubectl delete -f infrastructure/k8s/
	@echo "$(GREEN)Resources deleted$(RESET)"

k8s-status: ## Check Kubernetes cluster status
	@kubectl get pods,svc,deployments

deploy-staging: ## Deploy to staging environment
	@echo "$(BLUE)Deploying to staging...$(RESET)"
	@./scripts/deploy.sh staging
	@echo "$(GREEN)Deployed to staging$(RESET)"

deploy-production: ## Deploy to production environment
	@echo "$(BLUE)Deploying to production...$(RESET)"
	@./scripts/deploy.sh production
	@echo "$(GREEN)Deployed to production$(RESET)"

monitoring: ## Open monitoring dashboards
	@echo "Opening monitoring dashboards..."
	@open http://localhost:3001  # Grafana
	@open http://localhost:9090  # Prometheus
	@open http://localhost:16686 # Jaeger

db-console: ## Open PostgreSQL console
	@docker exec -it booksygo-postgres psql -U booksygo -d booksygo

redis-cli: ## Open Redis CLI
	@docker exec -it booksygo-redis redis-cli -a booksygo_redis_password

backup-db: ## Backup database
	@echo "$(BLUE)Backing up database...$(RESET)"
	@mkdir -p backups
	@docker exec booksygo-postgres pg_dump -U booksygo booksygo > backups/backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "$(GREEN)Database backed up to backups/$(RESET)"

restore-db: ## Restore database from backup (usage: make restore-db BACKUP=filename.sql)
	@echo "$(BLUE)Restoring database from $(BACKUP)...$(RESET)"
	@docker exec -i booksygo-postgres psql -U booksygo booksygo < backups/$(BACKUP)
	@echo "$(GREEN)Database restored$(RESET)"

install: ## Install all dependencies
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	@cd frontend && npm install
	@cd services/api-gateway && npm install
	@cd services/user-service && npm install
	@cd services/booking-service && npm install
	@cd services/package-service && npm install
	@cd services/payment-service && npm install
	@cd services/notification-service && npm install
	@cd services/gamification-service && npm install
	@cd services/analytics-service && npm install
	@cd services/search-service && pip install -r requirements.txt
	@cd services/ai-service && pip install -r requirements.txt
	@echo "$(GREEN)Dependencies installed$(RESET)"

check-health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(RESET)"
	@curl -s http://localhost:4000/health || echo "API Gateway: DOWN"
	@curl -s http://localhost:9200/_cluster/health || echo "Elasticsearch: DOWN"
	@docker exec booksygo-redis redis-cli -a booksygo_redis_password ping || echo "Redis: DOWN"
	@docker exec booksygo-postgres pg_isready -U booksygo || echo "PostgreSQL: DOWN"

security-scan: ## Run security vulnerability scan
	@echo "$(BLUE)Running security scan...$(RESET)"
	@npm audit
	@docker scan booksygo-api-gateway || true
	@echo "$(GREEN)Security scan complete$(RESET)"

performance-test: ## Run performance tests
	@echo "$(BLUE)Running performance tests...$(RESET)"
	@k6 run tests/performance/load-test.js
	@echo "$(GREEN)Performance tests complete$(RESET)"

docs: ## Generate and serve documentation
	@echo "$(BLUE)Generating documentation...$(RESET)"
	@cd docs && npm run serve

version: ## Show version information
	@echo "BooksyGo v1.0.0"
	@echo "Node: $$(node --version)"
	@echo "Docker: $$(docker --version)"
	@echo "Kubernetes: $$(kubectl version --client --short 2>/dev/null || echo 'Not installed')"

