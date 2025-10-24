#!/bin/bash

# Atlas Catalog - Automated Setup Script
# This script automates the initial setup process

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   Atlas Catalog - Setup Automatico   ║"
echo "╔═══════════════════════════════════════╝"
echo -e "${NC}"

# Function to print step
print_step() {
    echo -e "\n${BLUE}► $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
print_step "Verificando prerrequisitos..."
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi
print_success "Docker encontrado"

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi
print_success "Docker Compose encontrado"

# Check if make is available
if command -v make &> /dev/null; then
    USE_MAKE=true
    print_success "Make encontrado - usando Makefile"
else
    USE_MAKE=false
    print_warning "Make no encontrado - usando comandos Docker Compose directamente"
fi

# Create environment files
print_step "Configurando archivos de entorno..."

if [ ! -f .env ]; then
    cp .env.example .env
    print_success ".env creado"
else
    print_warning ".env ya existe (saltando)"
fi

if [ ! -f src/.env ]; then
    cp src/.env.example src/.env
    print_success "src/.env creado"
else
    print_warning "src/.env ya existe (saltando)"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.local.example frontend/.env.local
    print_success "frontend/.env.local creado"
else
    print_warning "frontend/.env.local ya existe (saltando)"
fi

# Ask user for environment
echo ""
echo -e "${YELLOW}¿Qué entorno quieres iniciar?${NC}"
echo "1) Desarrollo (con hot-reload)"
echo "2) Producción"
read -p "Selecciona una opción [1]: " env_choice
env_choice=${env_choice:-1}

# Start services based on choice
if [ "$env_choice" = "2" ]; then
    print_step "Iniciando entorno de PRODUCCIÓN..."
    if [ "$USE_MAKE" = true ]; then
        make prod-d
    else
        docker-compose up --build -d
    fi
    BACKEND_CONTAINER="atlas-backend"
else
    print_step "Iniciando entorno de DESARROLLO..."
    if [ "$USE_MAKE" = true ]; then
        make dev-d
    else
        docker-compose -f docker-compose.dev.yml up --build -d
    fi
    BACKEND_CONTAINER="atlas-backend-dev"
fi

# Wait for containers to be healthy
print_step "Esperando que los servicios estén listos..."
sleep 10

# Check if containers are running
if docker ps | grep -q "$BACKEND_CONTAINER"; then
    print_success "Contenedores iniciados correctamente"
else
    print_error "Error al iniciar contenedores. Revisa los logs:"
    if [ "$USE_MAKE" = true ]; then
        echo "  make logs"
    else
        if [ "$env_choice" = "2" ]; then
            echo "  docker-compose logs"
        else
            echo "  docker-compose -f docker-compose.dev.yml logs"
        fi
    fi
    exit 1
fi

# Run migrations
print_step "Ejecutando migraciones de base de datos..."
if docker exec -it "$BACKEND_CONTAINER" php artisan migrate:fresh --seed --force; then
    print_success "Migraciones ejecutadas correctamente"
else
    print_warning "Error al ejecutar migraciones. Intenta manualmente:"
    echo "  docker exec -it $BACKEND_CONTAINER php artisan migrate:fresh --seed"
fi

# Print success message
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════╗"
echo "║      ✓ Setup Completado!              ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${BLUE}🔗 URLs de Servicios:${NC}"
echo -e "   ${GREEN}Frontend:${NC}      http://localhost:3000"
echo -e "   ${GREEN}Backend API:${NC}   http://localhost:8080/api"
echo -e "   ${GREEN}Redis Insight:${NC} http://localhost:5540"

echo ""
echo -e "${BLUE}📋 Comandos Útiles:${NC}"
if [ "$USE_MAKE" = true ]; then
    echo "   Ver logs:          make logs"
    echo "   Ver estado:        make ps"
    echo "   Parar servicios:   make down"
    echo "   Reiniciar:         make restart"
    echo "   Ver ayuda:         make help"
else
    if [ "$env_choice" = "2" ]; then
        echo "   Ver logs:          docker-compose logs -f"
        echo "   Ver estado:        docker-compose ps"
        echo "   Parar servicios:   docker-compose down"
    else
        echo "   Ver logs:          docker-compose -f docker-compose.dev.yml logs -f"
        echo "   Ver estado:        docker-compose -f docker-compose.dev.yml ps"
        echo "   Parar servicios:   docker-compose -f docker-compose.dev.yml down"
    fi
fi

echo ""
echo -e "${YELLOW}📚 Documentación:${NC}"
echo "   - README.md           (Documentación general)"
echo "   - QUICK_START.md      (Inicio rápido)"
echo "   - DOCKER.md           (Documentación Docker)"
echo "   - FULL_STACK_SETUP.md (Setup completo)"

echo ""
echo -e "${GREEN}¡Listo para desarrollar! 🚀${NC}"
echo ""
