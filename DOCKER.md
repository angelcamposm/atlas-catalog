# Docker Deployment Guide - Atlas Catalog

Esta guía explica cómo ejecutar el proyecto completo usando Docker Compose.

## 🐳 Arquitectura Docker

El `docker-compose.yml` incluye los siguientes servicios:

1. **backend** - Laravel API (PHP 8.4 + Apache)

    - Puerto: `8080`
    - Endpoint: `http://localhost:8080/api`

2. **frontend** - Next.js Application (Node.js)

    - Puerto: `3000`
    - URL: `http://localhost:3000`

3. **postgres** - PostgreSQL Database

    - Puerto: `5432`
    - Base de datos para Laravel

4. **redis** - Redis Cache

    - Puerto: `6379`
    - Cache y sesiones

5. **redis-insights** - Redis GUI
    - Puerto: `5540`
    - Interfaz web para gestionar Redis

## 📋 Requisitos Previos

-   Docker Engine 20.10+
-   Docker Compose 2.0+
-   4GB RAM disponible (mínimo)
-   Puertos disponibles: 3000, 8080, 5432, 6379, 5540

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según sea necesario
nano .env
```

Variables importantes:

```env
# Database
DB_DATABASE=atlas_catalog
DB_USERNAME=atlas_user
DB_PASSWORD=atlas_secure_password_123

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Construir y Levantar los Servicios

```bash
# Construir las imágenes
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Ver los logs
docker-compose logs -f
```

### 3. Configurar el Backend Laravel

```bash
# Ejecutar migraciones
docker-compose exec backend php artisan migrate --force

# Ejecutar seeders (opcional)
docker-compose exec backend php artisan db:seed --force

# Generar APP_KEY si es necesario
docker-compose exec backend php artisan key:generate
```

### 4. Verificar los Servicios

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:8080/api
-   **Redis Insights**: http://localhost:5540

## 📂 Estructura de Servicios

### Backend (Laravel)

```
backend:
  - Puerto: 8080
  - Volúmenes: Ninguno (imagen standalone)
  - Depende de: postgres, redis
  - Healthcheck: Automático
```

**Rutas API disponibles:**

-   `GET /api/apis` - Lista de APIs
-   `GET /api/api-types` - Tipos de API
-   `GET /api/lifecycles` - Ciclos de vida
-   `GET /api/programming-languages` - Lenguajes de programación

### Frontend (Next.js)

```
frontend:
  - Puerto: 3000
  - Volúmenes: Ninguno (imagen standalone)
  - Depende de: backend
  - Variables de entorno: NEXT_PUBLIC_API_URL
```

### Base de Datos (PostgreSQL)

```
postgres:
  - Puerto: 5432
  - Volumen: postgres-data (persistente)
  - Imagen: postgres:17.6-alpine3.22
```

## 🔧 Comandos Útiles

### Gestión de Servicios

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reiniciar un servicio específico
docker-compose restart backend

# Ver logs de un servicio
docker-compose logs -f frontend

# Ver estado de los servicios
docker-compose ps
```

### Backend Laravel

```bash
# Acceder al contenedor
docker-compose exec backend bash

# Ejecutar Artisan commands
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

# Ver logs de Laravel
docker-compose exec backend tail -f storage/logs/laravel.log
```

### Frontend Next.js

```bash
# Acceder al contenedor
docker-compose exec frontend sh

# Ver logs
docker-compose logs -f frontend

# Reconstruir el frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Base de Datos

```bash
# Acceder a PostgreSQL
docker-compose exec postgres psql -U atlas_user -d atlas_catalog

# Backup de la base de datos
docker-compose exec postgres pg_dump -U atlas_user atlas_catalog > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U atlas_user atlas_catalog < backup.sql
```

## 🔄 Actualizar la Aplicación

### Actualizar Backend

```bash
# Reconstruir la imagen
docker-compose build backend

# Reiniciar el servicio
docker-compose up -d backend

# Ejecutar migraciones si hay cambios
docker-compose exec backend php artisan migrate --force
```

### Actualizar Frontend

```bash
# Reconstruir la imagen
docker-compose build frontend

# Reiniciar el servicio
docker-compose up -d frontend
```

## 🧹 Limpieza

```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar también los volúmenes (¡CUIDADO: elimina datos!)
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Limpieza completa (contenedores, volúmenes, imágenes)
docker-compose down -v --rmi all
```

## 🐛 Solución de Problemas

### El frontend no puede conectarse al backend

**Problema**: Error de CORS o conexión rechazada

**Solución**:

1. Verificar que `NEXT_PUBLIC_API_URL` esté correctamente configurado
2. Verificar que el backend esté corriendo: `docker-compose ps`
3. Revisar logs del backend: `docker-compose logs backend`
4. Verificar configuración CORS en `src/config/cors.php`

### Las migraciones fallan

**Problema**: Error al ejecutar migraciones

**Solución**:

```bash
# Verificar conexión a la base de datos
docker-compose exec backend php artisan migrate:status

# Limpiar cache de configuración
docker-compose exec backend php artisan config:clear

# Intentar de nuevo
docker-compose exec backend php artisan migrate --force
```

### El servicio no inicia

**Problema**: Contenedor se detiene inmediatamente

**Solución**:

```bash
# Ver logs del servicio
docker-compose logs backend

# Verificar el estado
docker-compose ps

# Reconstruir sin cache
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Puerto en uso

**Problema**: "Port already in use"

**Solución**:

```bash
# Identificar el proceso usando el puerto
lsof -i :8080  # o el puerto en conflicto

# Cambiar el puerto en docker-compose.yml
# Por ejemplo, de "8080:8080" a "8081:8080"
```

## 📊 Monitoreo

### Ver Recursos Utilizados

```bash
# Ver estadísticas de contenedores
docker stats

# Ver uso de espacio
docker system df

# Ver volúmenes
docker volume ls
```

### Redis Insights

Accede a http://localhost:5540 para:

-   Ver datos en Redis
-   Monitorear rendimiento
-   Gestionar keys
-   Analizar memoria

## 🔒 Seguridad en Producción

Para producción, asegúrate de:

1. **Cambiar credenciales por defecto**

    ```env
    DB_PASSWORD=<password-seguro-aleatorio>
    ```

2. **Deshabilitar debug**

    ```env
    APP_DEBUG=false
    ```

3. **Usar HTTPS**

    - Configurar proxy reverso (Nginx/Traefik)
    - Obtener certificados SSL

4. **Limitar puertos expuestos**

    - No exponer PostgreSQL (puerto 5432) públicamente
    - No exponer Redis (puerto 6379) públicamente

5. **Configurar variables de entorno seguras**
    - Usar secretos de Docker Swarm o Kubernetes
    - No commitear archivos `.env` con credenciales reales

## 📚 Recursos Adicionales

-   [Docker Documentation](https://docs.docker.com/)
-   [Docker Compose Documentation](https://docs.docker.com/compose/)
-   [Laravel Deployment](https://laravel.com/docs/11.x/deployment)
-   [Next.js Deployment](https://nextjs.org/docs/deployment)

## 💡 Tips

1. **Desarrollo Local**: Usa volúmenes para hot-reload
2. **Producción**: Usa imágenes standalone (como está configurado)
3. **CI/CD**: Integra con GitHub Actions o GitLab CI
4. **Escalabilidad**: Considera usar Kubernetes para múltiples instancias
