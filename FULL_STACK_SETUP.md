# Atlas Catalog - Full Stack Project

Este proyecto ahora es una aplicación full-stack completa con:

## 🎯 Estructura del Proyecto

### Backend (src/)

-   **Framework**: Laravel 11.x
-   **PHP**: 8.2+
-   **API**: RESTful JSON API
-   **Base de datos**: SQLite/MySQL/PostgreSQL

### Frontend (frontend/)

-   **Framework**: Next.js 15 (App Router)
-   **Lenguaje**: TypeScript (modo estricto)
-   **UI**: React 18 + Tailwind CSS
-   **Cliente API**: Fetch wrapper personalizado con TypeScript

## 📁 Archivos Creados

### Frontend

```
frontend/
├── lib/
│   ├── api-client.ts              # Cliente API centralizado
│   └── api/
│       ├── index.ts               # Exportaciones centralizadas
│       ├── apis.ts                # Endpoints de APIs
│       ├── api-types.ts           # Endpoints de tipos de API
│       ├── lifecycles.ts          # Endpoints de ciclos de vida
│       └── programming-languages.ts  # Endpoints de lenguajes
├── types/
│   └── api.ts                     # Definiciones TypeScript
├── components/
│   └── ui/
│       ├── Card.tsx               # Componente de tarjeta
│       ├── Button.tsx             # Componente de botón
│       └── LoadingSpinner.tsx     # Componente de carga
├── app/
│   └── page.tsx                   # Página principal actualizada
└── .env.local.example             # Variables de entorno de ejemplo
```

### Documentación

```
.github/
├── copilot-instructions.md        # Instrucciones completas para Copilot
│                                  # (incluye backend Laravel + frontend Next.js)
└── agents.md                      # Configuración para agentes de IA
                                   # (patrones, flujos de trabajo, restricciones)
```

### Configuración

```
.gitignore                         # Actualizado con exclusiones de Next.js
README.md                          # README principal actualizado
```

## 🚀 Inicio Rápido

### 1. Backend (Laravel)

```bash
cd src
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
# API disponible en http://localhost:8000
```

### 2. Frontend (Next.js)

```bash
cd frontend
pnpm install
cp .env.local.example .env.local
pnpm dev
# Frontend disponible en http://localhost:3000
```

## 🎨 Características del Frontend

### Cliente API TypeScript

-   Manejo automático de timeouts
-   Manejo de errores con tipos personalizados
-   Type-safe para requests/responses
-   Headers y configuración consistentes

### Componentes UI

-   **Card**: Contenedor con header y contenido
-   **Button**: Botón con variantes (primary, secondary, danger, ghost)
-   **LoadingSpinner**: Indicador de carga

### Tipos TypeScript

Todas las interfaces coinciden con los API Resources de Laravel:

-   `Api`, `ApiType`, `Lifecycle`, `ProgrammingLanguage`
-   Request types: `CreateApiRequest`, `UpdateApiRequest`, etc.
-   Response types: `PaginatedResponse<T>`, `ApiResponse<T>`

## 📚 Instrucciones para Copilot

Los archivos `.github/copilot-instructions.md` y `.github/agents.md` contienen:

### Backend (Laravel)

-   Convenciones de código PHP/Laravel
-   Patrones de Modelos con Observers
-   Estructura de Controladores RESTful
-   API Resources y Form Requests
-   Migraciones y Seeders
-   Testing con PHPUnit

### Frontend (Next.js)

-   Estándares TypeScript/React
-   Estructura de componentes
-   Integración con API
-   Patrones de formularios
-   Manejo de estados (loading/error)
-   Styling con Tailwind CSS
-   App Router de Next.js 15

### Flujos de Trabajo

-   Desarrollo de nuevas features (backend + frontend)
-   Testing y validación
-   Optimización de rendimiento
-   Manejo de errores
-   Responsive design

## 🔗 Puntos de Integración

-   **API Base URL**: Configurada via `NEXT_PUBLIC_API_URL`
-   **CORS**: El backend debe permitir el origen del frontend
-   **Formato de datos**: JSON con estructura consistente
-   **Autenticación**: Por implementar (JWT/Session)

## 📝 Próximos Pasos

1. Crear páginas específicas en `frontend/app/`:

    - `/apis` - Lista y gestión de APIs
    - `/api-types` - Gestión de tipos de API
    - `/lifecycles` - Gestión de ciclos de vida
    - `/programming-languages` - Gestión de lenguajes

2. Implementar formularios para CRUD
3. Agregar autenticación
4. Configurar CORS en Laravel
5. Implementar tests en ambos lados

## 🛠️ Herramientas de Desarrollo

### Backend

-   Laravel Pint (formatting)
-   PHPStan/Larastan (análisis estático)
-   PHPUnit (testing)

### Frontend

-   ESLint (linting)
-   TypeScript compiler (type checking)
-   Tailwind CSS (styling)
-   Turbopack (dev server)

## 📖 Recursos

-   [Laravel 11.x Docs](https://laravel.com/docs/11.x)
-   [Next.js 15 Docs](https://nextjs.org/docs)
-   [TypeScript Handbook](https://www.typescriptlang.org/docs/)
-   [Tailwind CSS Docs](https://tailwindcss.com/docs)
