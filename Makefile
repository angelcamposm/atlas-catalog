REGISTRY :=
ORGANIZATION :=
REPOSITORY := atlas-catalog
TAG := latest

FULL_IMAGE_NAME := $(REPOSITORY):$(TAG)

##@ Docker Build

.PHONY: build
build: ## Build backend Docker image
	docker build --tag $(FULL_IMAGE_NAME) -f Dockerfile .

build-frontend: ## Build frontend Docker image
	docker build --tag atlas-frontend:$(TAG) -f frontend/Dockerfile ./frontend

##@ General

.PHONY: help
help: ## Mostrar esta ayuda
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Setup

.PHONY: setup
setup: ## Setup inicial del proyecto (copiar .env y instalar dependencias)
	@echo "📦 Setup inicial..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "✅ .env creado"; fi
	@if [ ! -f src/.env ]; then cp src/.env.example src/.env; echo "✅ src/.env creado"; fi
	@if [ ! -f frontend/.env.local ]; then cp frontend/.env.local.example frontend/.env.local; echo "✅ frontend/.env.local creado"; fi
	@echo "✅ Setup completado"

.PHONY: install-backend
install-backend: ## Instalar dependencias del backend
	@echo "📦 Instalando dependencias del backend..."
	@cd src && composer install
	@echo "✅ Dependencias del backend instaladas"

.PHONY: install-frontend
install-frontend: ## Instalar dependencias del frontend
	@echo "📦 Instalando dependencias del frontend..."
	@cd frontend && npm install
	@echo "✅ Dependencias del frontend instaladas"

.PHONY: install
install: install-backend install-frontend ## Instalar todas las dependencias

##@ Development

.PHONY: dev
dev: ## Iniciar entorno de desarrollo (con hot-reload)
	@echo "🚀 Iniciando entorno de desarrollo..."
	docker-compose -f docker-compose.dev.yml up --build

.PHONY: dev-d
dev-d: ## Iniciar entorno de desarrollo en background
	@echo "🚀 Iniciando entorno de desarrollo en background..."
	docker-compose -f docker-compose.dev.yml up --build -d

.PHONY: dev-logs
dev-logs: ## Ver logs del entorno de desarrollo
	docker-compose -f docker-compose.dev.yml logs -f

.PHONY: dev-down
dev-down: ## Detener entorno de desarrollo
	@echo "🛑 Deteniendo entorno de desarrollo..."
	docker-compose -f docker-compose.dev.yml down

##@ Production

.PHONY: prod
prod: ## Iniciar entorno de producción
	@echo "🚀 Iniciando entorno de producción..."
	docker-compose up --build

.PHONY: prod-d
prod-d: ## Iniciar entorno de producción en background
	@echo "🚀 Iniciando entorno de producción en background..."
	docker-compose up --build -d

.PHONY: prod-logs
prod-logs: ## Ver logs del entorno de producción
	docker-compose logs -f

.PHONY: prod-down
prod-down: ## Detener entorno de producción
	@echo "🛑 Deteniendo entorno de producción..."
	docker-compose down

##@ Docker Management

.PHONY: up
up: dev-d ## Alias para dev-d (iniciar desarrollo)

.PHONY: down
down: dev-down ## Alias para dev-down (detener desarrollo)

.PHONY: restart
restart: down up ## Reiniciar contenedores de desarrollo

.PHONY: ps
ps: ## Mostrar estado de contenedores
	@docker-compose -f docker-compose.dev.yml ps

.PHONY: logs
logs: ## Ver logs de todos los servicios
	@docker-compose -f docker-compose.dev.yml logs -f

.PHONY: logs-backend
logs-backend: ## Ver logs del backend
	@docker-compose -f docker-compose.dev.yml logs -f backend

.PHONY: logs-frontend
logs-frontend: ## Ver logs del frontend
	@docker-compose -f docker-compose.dev.yml logs -f frontend-dev

.PHONY: shell-backend
shell-backend: ## Abrir shell en contenedor backend
	@docker exec -it atlas-backend-dev bash

.PHONY: shell-frontend
shell-frontend: ## Abrir shell en contenedor frontend
	@docker exec -it atlas-frontend-dev sh

##@ Database

.PHONY: migrate
migrate: ## Ejecutar migraciones
	@echo "🗄️  Ejecutando migraciones..."
	@docker exec -it atlas-backend-dev php artisan migrate

.PHONY: migrate-fresh
migrate-fresh: ## Recrear base de datos (⚠️  destruye datos)
	@echo "⚠️  Recreando base de datos..."
	@docker exec -it atlas-backend-dev php artisan migrate:fresh

.PHONY: seed
seed: ## Ejecutar seeders
	@echo "🌱 Ejecutando seeders..."
	@docker exec -it atlas-backend-dev php artisan db:seed

.PHONY: fresh
fresh: migrate-fresh seed ## Recrear DB y ejecutar seeders

.PHONY: rollback
rollback: ## Revertir última migración
	@echo "⏪ Revirtiendo migración..."
	@docker exec -it atlas-backend-dev php artisan migrate:rollback

##@ Testing

.PHONY: test
test: ## Ejecutar tests del backend
	@echo "🧪 Ejecutando tests..."
	@docker exec -it atlas-backend-dev php artisan test

.PHONY: test-coverage
test-coverage: ## Ejecutar tests con coverage
	@echo "🧪 Ejecutando tests con coverage..."
	@docker exec -it atlas-backend-dev php artisan test --coverage

.PHONY: lint-backend
lint-backend: ## Verificar código Laravel con Pint
	@echo "🔍 Verificando código backend..."
	@docker exec -it atlas-backend-dev ./vendor/bin/pint --test

.PHONY: lint-backend-fix
lint-backend-fix: ## Corregir código Laravel con Pint
	@echo "🔧 Corrigiendo código backend..."
	@docker exec -it atlas-backend-dev ./vendor/bin/pint

.PHONY: lint-frontend
lint-frontend: ## Verificar código Next.js
	@echo "🔍 Verificando código frontend..."
	@cd frontend && npm run lint

##@ Cleanup

.PHONY: clean
clean: ## Limpiar contenedores, volúmenes e imágenes
	@echo "🧹 Limpiando..."
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v
	@echo "✅ Limpieza completada"

.PHONY: clean-all
clean-all: clean ## Limpiar todo incluyendo node_modules y vendor
	@echo "🧹 Limpieza profunda..."
	@rm -rf src/vendor
	@rm -rf frontend/node_modules
	@rm -rf frontend/.next
	@echo "✅ Limpieza profunda completada"

##@ Utility

.PHONY: artisan
artisan: ## Ejecutar comando artisan (uso: make artisan CMD="route:list")
	@docker exec -it atlas-backend-dev php artisan $(CMD)

.PHONY: composer
composer: ## Ejecutar comando composer (uso: make composer CMD="require package")
	@docker exec -it atlas-backend-dev composer $(CMD)

.PHONY: npm
npm: ## Ejecutar comando npm (uso: make npm CMD="install package")
	@docker exec -it atlas-frontend-dev npm $(CMD)

.PHONY: redis-cli
redis-cli: ## Abrir Redis CLI
	@docker exec -it redis-dev redis-cli

.PHONY: psql
psql: ## Abrir PostgreSQL CLI
	@docker exec -it postgres-dev psql -U laravel -d laravel

##@ Info

.PHONY: info
info: ## Mostrar información del proyecto
	@echo "\n📊 Atlas Catalog - Información del Proyecto\n"
	@echo "🔗 URLs de Servicios:"
	@echo "   Frontend:      http://localhost:3000"
	@echo "   Backend API:   http://localhost:8080/api"
	@echo "   Redis Insight: http://localhost:5540"
	@echo "\n🗄️  Base de Datos:"
	@echo "   Host:     localhost:5432"
	@echo "   Database: laravel"
	@echo "   User:     laravel"
	@echo "\n📦 Versiones:"
	@echo "   PHP:       8.4.13"
	@echo "   Laravel:   11.x"
	@echo "   Node:      22.x"
	@echo "   Next.js:   15.0.0"
	@echo "   PostgreSQL: 17.6"
	@echo "   Redis:     8.2.1"
	@echo ""
