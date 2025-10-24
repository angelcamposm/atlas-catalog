#!/bin/bash

# Atlas Catalog - Health Check Script
# Verifica el estado de todos los servicios

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   Atlas Catalog - Health Check       ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Function to check service
check_service() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    echo -n "Checking $name... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null); then
        if [ "$response" -eq "$expected_code" ] || [ "$response" -eq 200 ] || [ "$response" -eq 302 ]; then
            echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
            return 0
        else
            echo -e "${YELLOW}⚠ Warning${NC} (HTTP $response)"
            return 1
        fi
    else
        echo -e "${RED}✗ Failed${NC} (No response)"
        return 1
    fi
}

# Function to check container
check_container() {
    local container=$1
    echo -n "Checking container $container... "
    
    if docker ps | grep -q "$container"; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not running${NC}"
        return 1
    fi
}

# Function to check database connection
check_database() {
    local container=$1
    echo -n "Checking database connection... "
    
    if docker exec "$container" php artisan db:show &>/dev/null; then
        echo -e "${GREEN}✓ Connected${NC}"
        return 0
    else
        echo -e "${RED}✗ Connection failed${NC}"
        return 1
    fi
}

# Determine environment
if docker ps | grep -q "atlas-backend-dev"; then
    ENV="development"
    BACKEND_CONTAINER="atlas-backend-dev"
    FRONTEND_CONTAINER="atlas-frontend-dev"
    POSTGRES_CONTAINER="postgres-dev"
    REDIS_CONTAINER="redis-dev"
    echo -e "${BLUE}Environment: Development${NC}\n"
elif docker ps | grep -q "atlas-backend"; then
    ENV="production"
    BACKEND_CONTAINER="atlas-backend"
    FRONTEND_CONTAINER="atlas-frontend"
    POSTGRES_CONTAINER="postgres"
    REDIS_CONTAINER="redis"
    echo -e "${BLUE}Environment: Production${NC}\n"
else
    echo -e "${RED}No Atlas Catalog containers running!${NC}"
    echo "Start the services first:"
    echo "  Development: make dev-d"
    echo "  Production:  make prod-d"
    exit 1
fi

# Check containers
echo -e "${YELLOW}== Container Status ==${NC}"
check_container "$BACKEND_CONTAINER"
check_container "$FRONTEND_CONTAINER"
check_container "$POSTGRES_CONTAINER"
check_container "$REDIS_CONTAINER"

# Check HTTP endpoints
echo ""
echo -e "${YELLOW}== HTTP Services ==${NC}"
check_service "Frontend" "http://localhost:3000"
check_service "Backend API" "http://localhost:8080/api"
check_service "Backend Health" "http://localhost:8080/api/health" 200
check_service "Redis Insights" "http://localhost:5540"

# Check database
echo ""
echo -e "${YELLOW}== Database ==${NC}"
check_database "$BACKEND_CONTAINER"

# Check Redis
echo ""
echo -e "${YELLOW}== Redis ==${NC}"
echo -n "Checking Redis connection... "
if docker exec "$REDIS_CONTAINER" redis-cli ping &>/dev/null; then
    echo -e "${GREEN}✓ PONG${NC}"
else
    echo -e "${RED}✗ No response${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"

# Count running containers
EXPECTED=5
RUNNING=$(docker ps | grep -c "atlas\|postgres\|redis" || true)

if [ "$RUNNING" -eq "$EXPECTED" ]; then
    echo -e "${GREEN}║  All services are healthy! ✓          ║${NC}"
else
    echo -e "${YELLOW}║  Some services need attention         ║${NC}"
    echo -e "${YELLOW}║  Running: $RUNNING/$EXPECTED                           ║${NC}"
fi

echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"

# URLs
echo ""
echo -e "${BLUE}🔗 Service URLs:${NC}"
echo "   Frontend:      http://localhost:3000"
echo "   Backend API:   http://localhost:8080/api"
echo "   Redis Insight: http://localhost:5540"

# Helpful commands
echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo "   View logs:     make logs"
echo "   View status:   make ps"
echo "   Restart:       make restart"
echo ""
