#!/bin/bash

# Atlas Catalog - Quick Start Script
# This script helps you quickly start the Atlas Catalog application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if docker-compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed. Please install it and try again."
        exit 1
    fi
    print_success "docker-compose is installed"
}

# Function to create .env file if it doesn't exist
create_env_file() {
    if [ ! -f .env ]; then
        print_info "Creating .env file..."
        cat > .env << EOF
# Database Configuration
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

# Redis Configuration
REDIS_ENCRYPTION_KEY=j8avWnevHBh2ylooVLLseyFfiRVwtmhVVoVvHXMuV3I=

# Application Configuration
APP_ENV=production
APP_DEBUG=false
EOF
        print_success ".env file created"
    else
        print_info ".env file already exists"
    fi
}

# Function to display menu
show_menu() {
    echo ""
    echo "======================================"
    echo "   Atlas Catalog - Quick Start Menu"
    echo "======================================"
    echo ""
    echo "1) Start Production Environment"
    echo "2) Start Development Environment"
    echo "3) Stop All Services"
    echo "4) View Logs"
    echo "5) Check Services Status"
    echo "6) Run Database Migrations"
    echo "7) Clean Everything"
    echo "8) Exit"
    echo ""
}

# Function to start production environment
start_production() {
    print_info "Starting production environment..."
    docker-compose build
    docker-compose up -d
    
    print_info "Waiting for services to be ready..."
    sleep 5
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Production environment started successfully!"
        echo ""
        echo "🌐 Access your application:"
        echo "   Frontend:    http://localhost:3000"
        echo "   Backend API: http://localhost:8080/api"
        echo "   RedisInsight: http://localhost:5540"
        echo ""
    else
        print_error "Some services failed to start. Check logs with: docker-compose logs"
    fi
}

# Function to start development environment
start_development() {
    print_info "Starting development environment..."
    docker-compose -f docker-compose.dev.yml build
    docker-compose -f docker-compose.dev.yml up -d
    
    print_info "Waiting for services to be ready..."
    sleep 5
    
    # Check if services are running
    if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        print_success "Development environment started successfully!"
        echo ""
        echo "🌐 Access your application:"
        echo "   Frontend (dev):    http://localhost:3000"
        echo "   Backend API (dev): http://localhost:8080/api"
        echo "   RedisInsight:      http://localhost:5540"
        echo ""
        echo "💡 Development features enabled:"
        echo "   - Hot reload for frontend and backend"
        echo "   - Debug mode enabled"
        echo "   - Source code mounted as volumes"
        echo ""
    else
        print_error "Some services failed to start. Check logs with: docker-compose -f docker-compose.dev.yml logs"
    fi
}

# Function to stop all services
stop_services() {
    print_info "Stopping all services..."
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    print_success "All services stopped"
}

# Function to view logs
view_logs() {
    echo ""
    echo "Which logs do you want to view?"
    echo "1) All services"
    echo "2) Frontend only"
    echo "3) Backend only"
    echo "4) Database only"
    echo ""
    read -p "Enter your choice: " log_choice
    
    case $log_choice in
        1)
            docker-compose logs -f
            ;;
        2)
            docker-compose logs -f frontend
            ;;
        3)
            docker-compose logs -f app nginx
            ;;
        4)
            docker-compose logs -f postgres
            ;;
        *)
            print_error "Invalid choice"
            ;;
    esac
}

# Function to check services status
check_status() {
    print_info "Checking services status..."
    echo ""
    echo "Production Services:"
    docker-compose ps 2>/dev/null || echo "No production services running"
    echo ""
    echo "Development Services:"
    docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "No development services running"
}

# Function to run migrations
run_migrations() {
    print_info "Running database migrations..."
    
    # Check which environment is running
    if docker-compose ps | grep -q "app.*Up"; then
        docker-compose exec app php artisan migrate --seed
        print_success "Migrations completed (production)"
    elif docker-compose -f docker-compose.dev.yml ps | grep -q "backend.*Up"; then
        docker-compose -f docker-compose.dev.yml exec backend php artisan migrate --seed
        print_success "Migrations completed (development)"
    else
        print_error "No backend service is running. Please start the environment first."
    fi
}

# Function to clean everything
clean_everything() {
    print_warning "This will remove all containers, volumes, and images!"
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        print_info "Cleaning production environment..."
        docker-compose down -v 2>/dev/null || true
        
        print_info "Cleaning development environment..."
        docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
        
        print_info "Removing Atlas images..."
        docker images | grep atlas | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
        
        print_success "Everything cleaned!"
    else
        print_info "Cleanup cancelled"
    fi
}

# Main script
main() {
    clear
    echo ""
    echo "🚀 Atlas Catalog - Quick Start"
    echo ""
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    check_docker
    check_docker_compose
    create_env_file
    
    # Show menu and handle user input
    while true; do
        show_menu
        read -p "Enter your choice: " choice
        
        case $choice in
            1)
                start_production
                ;;
            2)
                start_development
                ;;
            3)
                stop_services
                ;;
            4)
                view_logs
                ;;
            5)
                check_status
                ;;
            6)
                run_migrations
                ;;
            7)
                clean_everything
                ;;
            8)
                print_info "Goodbye! 👋"
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please try again."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run the main function
main
