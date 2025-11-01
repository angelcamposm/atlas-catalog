# 🚀 Atlas Catalog - Quick Start Guide

Get Atlas Catalog running in less than 5 minutes!

## Prerequisites

-   Docker Engine 20.10+
-   Docker Compose 2.0+
-   4GB RAM available (minimum)
-   Git

## Quick Start (3 Options)

### Option 1: Interactive Script (Easiest) ⭐

```bash
# 1. Clone the repository
git clone https://github.com/angelcamposm/atlas-catalog.git
cd atlas-catalog

# 2. Run the interactive script
./start.sh
```

The script provides an interactive menu to:

-   ✅ Start production or development environment
-   ✅ View logs and check service status
-   ✅ Run database migrations
-   ✅ Clean up everything

### Option 2: Using Makefile (Recommended for developers)

```bash
# Start production environment
make -f Makefile.docker prod

# Or start development environment (with hot-reload)
make -f Makefile.docker dev

# View all available commands
make -f Makefile.docker help
```

### Option 3: Manual Docker Compose

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd atlas-catalog

# 2. Configurar variables de entorno
cp .env.example .env
cp src/.env.example src/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Iniciar servicios
docker-compose -f docker-compose.dev.yml up --build -d

# 4. Ejecutar migraciones y seeders
docker exec -it atlas-backend-dev php artisan migrate:fresh --seed
```

## Verificar Instalación

### 1. Verificar que todos los servicios están corriendo

```bash
make ps
# o
docker-compose -f docker-compose.dev.yml ps
```

Deberías ver 5 contenedores corriendo:

-   `atlas-backend-dev`
-   `atlas-frontend-dev`
-   `postgres-dev`
-   `redis-dev`
-   `redis-insights-dev`

### 2. Probar el Backend API

```bash
curl http://localhost:8080/api/apis
```

Debería devolver una lista de APIs en formato JSON.

### 3. Probar el Frontend

Abre tu navegador en http://localhost:3000

Deberías ver el dashboard de Atlas Catalog.

## Comandos Útiles

```bash
# Ver todos los comandos disponibles
make help

# Ver logs en tiempo real
make logs

# Ver logs de un servicio específico
make logs-backend
make logs-frontend

# Acceder al shell del backend
make shell-backend

# Acceder al shell del frontend
make shell-frontend

# Ejecutar tests
make test

# Detener servicios
make down

# Reiniciar servicios
make restart

# Limpiar todo
make clean
```

## Solución de Problemas

### Los contenedores no inician

```bash
# Verificar logs
make logs

# Recrear contenedores
make down
make clean
make dev-d
```

### Error de base de datos

```bash
# Recrear base de datos
make fresh
```

### El frontend no se conecta al backend

1. Verificar que `frontend/.env.local` existe y contiene:

    ```
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ```

2. Reiniciar el frontend:
    ```bash
    docker restart atlas-frontend-dev
    ```

### Puerto ya en uso

Si algún puerto (3000, 8080, 5432) está en uso:

1. Detener el servicio que usa ese puerto
2. O modificar el puerto en `docker-compose.dev.yml`

## Siguiente Paso

-   Lee la [documentación completa](README.md)
-   Explora el [setup full-stack](FULL_STACK_SETUP.md)
-   Revisa la [documentación de Docker](DOCKER.md)

## Desarrollo

### Estructura de Archivos

```
atlas-catalog/
├── src/              # Backend Laravel
├── frontend/         # Frontend Next.js
├── .github/          # GitHub Actions y documentación
├── iac/              # Kubernetes manifests
└── docker-compose.dev.yml  # Configuración de desarrollo
```

### Hot Reload

El entorno de desarrollo incluye hot-reload automático:

-   **Backend**: Los cambios en `src/` se reflejan automáticamente
-   **Frontend**: Los cambios en `frontend/` activan Fast Refresh de Next.js

### Base de Datos

Acceder a PostgreSQL:

```bash
make psql
# o
docker exec -it postgres-dev psql -U laravel -d laravel
```

Acceder a Redis CLI:

```bash
make redis-cli
# o
docker exec -it redis-dev redis-cli
```

## Datos de Prueba

El seeder carga datos de ejemplo:

-   **API Types**: REST, GraphQL, SOAP, WebSocket
-   **Lifecycles**: Planning, Development, Testing, Production, Deprecated
-   **Programming Languages**: PHP, JavaScript, Python, Java, etc.
-   **APIs de ejemplo**: Varias APIs con diferentes configuraciones

## Recursos

-   [Laravel Documentation](https://laravel.com/docs)
-   [Next.js Documentation](https://nextjs.org/docs)
-   [Docker Documentation](https://docs.docker.com)

---

**¿Problemas?** Abre un issue en el repositorio.
