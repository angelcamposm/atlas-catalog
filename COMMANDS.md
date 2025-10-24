# Atlas Catalog - Referencia Rápida de Comandos

## 🚀 Inicio Rápido

```bash
# Setup automático
./setup.sh

# O con Makefile
make setup && make dev-d && make fresh
```

## 📋 Comandos Makefile

### Setup y Configuración

```bash
make setup              # Setup inicial (copiar .env)
make install            # Instalar dependencias (backend + frontend)
make install-backend    # Solo backend
make install-frontend   # Solo frontend
```

### Desarrollo

```bash
make dev                # Iniciar desarrollo (foreground)
make dev-d              # Iniciar desarrollo (background)
make up                 # Alias de dev-d
make down               # Detener desarrollo
make restart            # Reiniciar servicios
```

### Producción

```bash
make prod               # Iniciar producción (foreground)
make prod-d             # Iniciar producción (background)
make prod-down          # Detener producción
```

### Logs y Monitoreo

```bash
make logs               # Ver logs de todos los servicios
make logs-backend       # Solo backend
make logs-frontend      # Solo frontend
make ps                 # Estado de contenedores
make info               # Información del proyecto
```

### Base de Datos

```bash
make migrate            # Ejecutar migraciones
make migrate-fresh      # Recrear DB (⚠️ borra datos)
make seed               # Ejecutar seeders
make fresh              # Recrear DB + seeders
make rollback           # Revertir última migración
make psql               # Abrir PostgreSQL CLI
```

### Testing y Linting

```bash
make test               # Ejecutar tests backend
make test-coverage      # Tests con coverage
make lint-backend       # Verificar código Laravel
make lint-backend-fix   # Corregir código Laravel
make lint-frontend      # Verificar código Next.js
```

### Shells y CLI

```bash
make shell-backend      # Shell del contenedor backend
make shell-frontend     # Shell del contenedor frontend
make redis-cli          # Redis CLI
make psql               # PostgreSQL CLI
```

### Comandos Personalizados

```bash
# Ejecutar comando Artisan
make artisan CMD="route:list"
make artisan CMD="make:controller MyController"

# Ejecutar comando Composer
make composer CMD="require package/name"
make composer CMD="dump-autoload"

# Ejecutar comando NPM
make npm CMD="install package-name"
make npm CMD="run build"
```

### Limpieza

```bash
make clean              # Limpiar contenedores y volúmenes
make clean-all          # Limpieza profunda (incluye node_modules)
```

## 🐳 Docker Compose

### Desarrollo

```bash
# Iniciar
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener
docker-compose -f docker-compose.dev.yml down

# Reiniciar un servicio
docker-compose -f docker-compose.dev.yml restart backend
```

### Producción

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Rebuild
docker-compose up --build --force-recreate
```

## 🔧 Scripts de Utilidad

```bash
# Setup automatizado
./setup.sh

# Health check
./health-check.sh
```

## 🏗️ Build Docker

```bash
# Build backend
make build

# Build frontend
make build-frontend

# Build manualmente
docker build -t atlas-backend:latest .
docker build -t atlas-frontend:latest ./frontend
```

## 📊 URLs de Servicios

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:3000 | Aplicación Next.js |
| Backend API | http://localhost:8080/api | API REST Laravel |
| Health Check | http://localhost:8080/api/health | Estado del sistema |
| Redis Insights | http://localhost:5540 | GUI Redis |
| PostgreSQL | localhost:5432 | Base de datos |
| Redis | localhost:6379 | Cache |

## 🗃️ Comandos de Base de Datos

### Migraciones

```bash
# Ejecutar migraciones
docker exec -it atlas-backend-dev php artisan migrate

# Recrear DB
docker exec -it atlas-backend-dev php artisan migrate:fresh

# Con seeders
docker exec -it atlas-backend-dev php artisan migrate:fresh --seed

# Revertir
docker exec -it atlas-backend-dev php artisan migrate:rollback

# Estado
docker exec -it atlas-backend-dev php artisan migrate:status
```

### Seeders

```bash
# Todos los seeders
docker exec -it atlas-backend-dev php artisan db:seed

# Seeder específico
docker exec -it atlas-backend-dev php artisan db:seed --class=ApiTypeSeeder
```

### Acceso Directo

```bash
# PostgreSQL CLI
docker exec -it postgres-dev psql -U laravel -d laravel

# Ejecutar query
docker exec -it postgres-dev psql -U laravel -d laravel -c "SELECT * FROM apis;"
```

## 🧪 Testing

### Backend (PHPUnit)

```bash
# Todos los tests
docker exec -it atlas-backend-dev php artisan test

# Test específico
docker exec -it atlas-backend-dev php artisan test --filter=ApiTest

# Con coverage
docker exec -it atlas-backend-dev php artisan test --coverage

# Parallel
docker exec -it atlas-backend-dev php artisan test --parallel
```

### Linting

```bash
# Laravel Pint - verificar
docker exec -it atlas-backend-dev ./vendor/bin/pint --test

# Laravel Pint - corregir
docker exec -it atlas-backend-dev ./vendor/bin/pint

# Next.js ESLint
cd frontend && npm run lint
```

## 🔍 Debugging

### Ver Logs

```bash
# Todos los logs
docker-compose -f docker-compose.dev.yml logs -f

# Un servicio
docker-compose -f docker-compose.dev.yml logs -f backend

# Últimas 100 líneas
docker-compose -f docker-compose.dev.yml logs --tail=100 backend
```

### Inspeccionar Contenedores

```bash
# Estado
docker-compose -f docker-compose.dev.yml ps

# Recursos
docker stats

# Inspeccionar
docker inspect atlas-backend-dev

# Processes
docker top atlas-backend-dev
```

### Redis

```bash
# Redis CLI
docker exec -it redis-dev redis-cli

# Ver keys
docker exec -it redis-dev redis-cli KEYS '*'

# Flush cache
docker exec -it redis-dev redis-cli FLUSHALL
```

## 🧹 Mantenimiento

### Limpiar Docker

```bash
# Detener todos los contenedores
docker stop $(docker ps -aq)

# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no usadas
docker image prune

# Eliminar volúmenes no usados
docker volume prune

# Limpieza completa
docker system prune -a --volumes
```

### Recrear Servicios

```bash
# Recrear todo
make clean && make dev-d && make fresh

# Solo un servicio
docker-compose -f docker-compose.dev.yml up -d --force-recreate backend
```

## 📦 Gestión de Dependencias

### Backend (Composer)

```bash
# Instalar
docker exec -it atlas-backend-dev composer install

# Actualizar
docker exec -it atlas-backend-dev composer update

# Require
docker exec -it atlas-backend-dev composer require vendor/package

# Dump autoload
docker exec -it atlas-backend-dev composer dump-autoload
```

### Frontend (NPM)

```bash
# Instalar
docker exec -it atlas-frontend-dev npm install

# Agregar paquete
docker exec -it atlas-frontend-dev npm install package-name

# Actualizar
docker exec -it atlas-frontend-dev npm update
```

## 🚨 Troubleshooting

### Contenedores no inician

```bash
# Ver logs de error
make logs

# Recrear desde cero
make clean
make dev-d
```

### Puerto en uso

```bash
# Verificar qué está usando el puerto
lsof -i :3000
lsof -i :8080

# Matar proceso
kill -9 <PID>
```

### Permisos en volúmenes

```bash
# Arreglar permisos
docker exec -it atlas-backend-dev chown -R www-data:www-data /var/www/html/storage
docker exec -it atlas-backend-dev chmod -R 775 /var/www/html/storage
```

---

**💡 Tip**: Ejecuta `make help` para ver todos los comandos disponibles.
