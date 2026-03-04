# Backend Implementation Plan — Atlas Catalog

> **Para Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans para implementar este plan task-by-task.

**Fecha:** 4 de marzo de 2026

**Goal:** Completar la implementación del backend Laravel, cerrando todas las brechas identificadas en autenticación, testing, consistencia de controllers, búsqueda/filtrado, y documentación de API.

**Arquitectura:** Backend API REST con Laravel 12 + PHP 8.4, PostgreSQL, Redis. Organización por dominios (catalog, infrastructure, architecture, organization, security, compliance, operations, ci-cd). Controllers RESTful con API Resources, Form Requests, Policies y Observers.

**Tech Stack:** PHP 8.4, Laravel 12, PHPUnit 12, PostgreSQL, Redis, Scramble (OpenAPI auto-gen)

---

## Tabla de Contenido

1. [Estado Actual del Backend](#1-estado-actual-del-backend)
2. [Hallazgos Críticos](#2-hallazgos-críticos)
3. [Épica 1 — Rutas Rotas y Código Muerto](#3-épica-1--rutas-rotas-y-código-muerto)
4. [Épica 2 — Consistencia de Controllers](#4-épica-2--consistencia-de-controllers)
5. [Épica 3 — Autenticación y Autorización](#5-épica-3--autenticación-y-autorización)
6. [Épica 4 — Feature Tests para API Endpoints](#6-épica-4--feature-tests-para-api-endpoints)
7. [Épica 5 — Búsqueda, Filtrado y Ordenamiento](#7-épica-5--búsqueda-filtrado-y-ordenamiento)
8. [Épica 6 — Seeders Faltantes](#8-épica-6--seeders-faltantes)
9. [Épica 7 — Rate Limiting y Middleware](#9-épica-7--rate-limiting-y-middleware)
10. [Épica 8 — Service Layer (Refactor Opcional)](#10-épica-8--service-layer-refactor-opcional)
11. [Épica 9 — Sincronización de API Spec](#11-épica-9--sincronización-de-api-spec)
12. [Épica 10 — Tests Unitarios Faltantes](#12-épica-10--tests-unitarios-faltantes)
13. [Priorización y Roadmap](#13-priorización-y-roadmap)

---

## 1. Estado Actual del Backend

### Inventario de Entidades

| Categoría | Cantidad | Estado |
|---|---|---|
| **Modelos** | 46 | ✅ Completos con relaciones, factories, casts |
| **Controllers** | 55 | ⚠️ Implementados pero con inconsistencias |
| **Form Requests** | 76 (38 Store + 38 Update) | ✅ Validaciones razonables |
| **API Resources** | 78 (39 + 39 Collections) | ✅ Completos |
| **Policies** | 39 | ⚠️ Stubs (todo retorna `true`) |
| **Observers** | 44 | ✅ Completos |
| **Enums** | 21 | ✅ Completos |
| **Seeders** | 24 | ⚠️ Parciales (faltan varios dominios) |
| **Migrations** | 52 | ✅ Completas |
| **Unit Tests** | ~110 archivos | ✅ Buenos para Models/Enums/Observers |
| **Feature Tests** | 1 (ExampleTest) | 🔴 Inexistentes |

### Dominios de Rutas API

| Dominio | Prefijo | Endpoints Registrados | Estado |
|---|---|---|---|
| **Catalog** | `/v1/catalog/` | APIs, Components, Environments, Frameworks, Links, Platforms, Programming Languages, Resources, Service Models | ✅ Funcional |
| **Architecture** | `/v1/architecture/` | Business Capabilities, Business Domains, Business Tiers, Entities, Lifecycles, Systems | ⚠️ 1 ruta rota |
| **Infrastructure** | `/v1/infrastructure/` | Clusters, Nodes, Types, Vendors | ✅ Funcional |
| **Organization** | `/v1/organization/` | Groups, Group Types, Member Roles, Users | ✅ Funcional |
| **Security** | `/v1/security/` | Auth Methods, Service Accounts, Tokens | ✅ Funcional |
| **CI/CD** | `/v1/ci-cd/` | Releases, Workflow Runs, Commits, Jobs | ✅ Funcional |
| **Compliance** | `/v1/compliance/` | Compliance Standards | ✅ Funcional |
| **Operations** | `/v1/operations/` | Service Statuses | ✅ Funcional |
| **Deployments** | *(sin rutas)* | ❌ Controller sin registrar | 🔴 No expuesto |

---

## 2. Hallazgos Críticos

### 🔴 Severidad Crítica

| # | Hallazgo | Ubicación |
|---|---|---|
| 1 | **0 autenticación/autorización** en rutas API — cualquier persona puede hacer CRUD completo | `routes/v1/*.php` |
| 2 | **0 feature tests** para endpoints API | `tests/Feature/` |
| 3 | **DeploymentController existe pero NO tiene rutas registradas** — código muerto | `DeploymentController.php` no referenciado en `routes/` |

### 🔴 Severidad Alta

| # | Hallazgo | Ubicación |
|---|---|---|
| 4 | **Ruta rota**: `entities/{entity}/components` sin controller asignado | `routes/v1/architecture.php:43-44` |
| 5 | **Ruta rota**: `apis/access-policies/{id}/apis` con controller vacío `[]` | `routes/v1/catalog.php:35` |
| 6 | **UserController.store()** llama `$request->validated()` en un `Request` genérico (no en FormRequest) — error en runtime | `UserController.php:55` |

### 🟠 Severidad Media

| # | Hallazgo | Ubicación |
|---|---|---|
| 7 | **0 rate limiting** en ninguna ruta | `bootstrap/app.php` |
| 8 | **0 búsqueda/filtrado/sort** — todos los `index()` hacen `Model::paginate()` sin query params | Todos los controllers |
| 9 | **Sin capa de servicios** — lógica de negocio directamente en controllers | No existe `app/Services/` |
| 10 | **API spec OpenAPI desincronizado** con la implementación real (paths diferentes, recursos faltantes) | `docs/api/v1.0.0.yml` |
| 11 | **Sin guard de API** configurado — solo session auth (web), no API tokens | `config/auth.php` |

### 🟡 Severidad Baja

| # | Hallazgo | Ubicación |
|---|---|---|
| 12 | **DeploymentController inconsistente** — mezcla `__invoke()`, `response()->json()` y no usa API Resources | `DeploymentController.php` |
| 13 | **SystemController no soporta `?with=`** — no usa trait `AllowedRelationships` | `SystemController.php` |
| 14 | **Sin seeders** para Clusters, Nodes, Deployments, Releases, Workflows, Links, Service Accounts | `database/seeders/` |
| 15 | **6 de 7 traits sin tests unitarios** | `tests/Unit/Traits/` |
| 16 | **Release model sin relación inversa** a Deployments | `Release.php` |
| 17 | **AppServiceProvider completamente vacío** — no registra nada | `AppServiceProvider.php` |
| 18 | **Policies son stubs** — todas retornan `true` | `app/Policies/` |
| 19 | **Sin custom error messages** en Form Requests | Todos los `*Request.php` |
| 20 | **CORS max_age = 0** — no cachea preflight requests | `config/cors.php` |
| 21 | **Ruta comentada** frameworks/{framework}/components | `routes/v1/catalog.php:56-58` |

---

## 3. Épica 1 — Rutas Rotas y Código Muerto

> **Prioridad:** 🔴 Crítica — La API actual tiene rutas que causan error 500.
> **Esfuerzo estimado:** 2-3 horas
> **Dependencias:** Ninguna

### Task 1.1: Corregir la ruta `entities/{entity}/components`

**Archivos:**
- Crear: `src/app/Http/Controllers/EntityComponentController.php`
- Modificar: `src/routes/v1/architecture.php:43-44`
- Test: `src/tests/Feature/EntityComponentTest.php`

**Contexto:** La ruta `entities/{entity}/components` está registrada sin controller. Debe seguir el patrón de los demás invokable controllers (como `BusinessDomainComponentController`, `PlatformComponentController`).

**Implementación esperada:**
```php
// EntityComponentController.php — Invokable controller
class EntityComponentController extends Controller
{
    public function __invoke(Entity $entity): ComponentResourceCollection
    {
        return new ComponentResourceCollection($entity->components()->paginate());
    }
}
```

**Corrección en ruta:**
```php
// De:
Route::get('entities/{entity}/components')->name('entities.components');
// A:
Route::get('entities/{entity}/components', EntityComponentController::class)
    ->name('entities.components');
```

---

### Task 1.2: Corregir la ruta `apis/access-policies/{id}/apis`

**Archivos:**
- Modificar: `src/routes/v1/catalog.php:35`
- Modificar: `src/app/Http/Controllers/ApiAccessPolicyController.php` (agregar método `apis`)

**Contexto:** La ruta tiene un array vacío `[]` como controller. Debe apuntar al método correcto del `ApiAccessPolicyController` o a un invokable controller dedicado.

---

### Task 1.3: Registrar rutas para DeploymentController

**Archivos:**
- Modificar: `src/routes/v1/operations.php` (o crear `src/routes/v1/deployments.php`)

**Contexto:** El `DeploymentController` está completamente implementado (index via `__invoke`, store, show, update) pero nunca fue registrado en las rutas. Debe exponerse en un dominio apropiado.

**Opciones:**
- **Opción A (recomendada):** Añadirlo al dominio `operations` → `GET /v1/operations/deployments`
- **Opción B:** Dentro de `ci-cd` → `GET /v1/ci-cd/deployments`
- **Opción C:** Dominio propio separado

> //TODO: 
> El controlador DeploymentController, es para recibir un POST con un payload con los detalles de la ejecución de un workflowRun en Jenkins actualmente. La información de los deployments, se mostraría via relaciones en los modelos, o bien en un sistema para mostrar los últimos eventos. Ej: últimos eventos (deployments, builds, actualizaciones, etc...)

---

### Task 1.4: Descomentar o implementar `frameworks/{framework}/components`

**Archivos:**
- Modificar: `src/routes/v1/catalog.php:56-58`
- Crear: `src/app/Http/Controllers/FrameworkComponentController.php`

---

### Task 1.5: Corregir UserController

**Archivos:**
- Crear: `src/app/Http/Requests/StoreUserRequest.php`
- Crear: `src/app/Http/Requests/UpdateUserRequest.php`
- Modificar: `src/app/Http/Controllers/UserController.php` — reemplazar `Request` genérico por Form Requests tipados

**Contexto:** `UserController::store()` y `update()` reciben `Illuminate\Http\Request` genérico y llaman `$request->validated()`, lo cual lanza excepción en runtime ya que `Request` no tiene ese método (es exclusivo de `FormRequest`).

---

## 4. Épica 2 — Consistencia de Controllers

> **Prioridad:** 🟠 Media — Garantizar patrones uniformes en toda la API.
> **Esfuerzo estimado:** 3-4 horas
> **Dependencias:** Épica 1

### Task 2.1: Refactorizar DeploymentController a patrón estándar

**Archivos:**
- Modificar: `src/app/Http/Controllers/DeploymentController.php`

**Cambios necesarios:**
1. Reemplazar `__invoke()` por `index()` estándar
2. Usar `DeploymentResource` en `store()`, `show()`, `update()` en vez de `response()->json()`
3. Agregar método `destroy()` faltante
4. Agregar trait `AllowedRelationships` con relaciones: `component`, `environment`, `cluster`, `release`, `workflowRun`, `triggerer`

> //TODO:
> Para recibir el Post, únicamente el método store() o __invoke(), para poder validar el input, únicamente se podría hacer mediante un json schema que defina lo que puede recibir, pues el formato es json.

---

### Task 2.2: Agregar `AllowedRelationships` a SystemController

**Archivos:**
- Modificar: `src/app/Http/Controllers/SystemController.php`

**Contexto:** Es el único controller principal que no soporta `?with=` para eager-loading. Debe añadir el trait con relaciones: `components`, `businessCapabilities`, `owner`, `creator`, `updater`.

---

### Task 2.3: Agregar relación inversa `deployments()` al modelo Release

**Archivos:**
- Modificar: `src/app/Models/Release.php`

**Contexto:** `Deployment` tiene `belongsTo(Release)` pero `Release` no tiene `hasMany(Deployment)`. Agregar:
```php
public function deployments(): HasMany
{
    return $this->hasMany(Deployment::class);
}
```

---

### Task 2.4: Auditar y estandarizar patrones de respuesta

**Contexto:** Verificar que TODOS los controllers sigan el patrón:
- `index()` → `*ResourceCollection`
- `store()` → `*Resource` con status 201
- `show()` → `*Resource`
- `update()` → `*Resource`
- `destroy()` → `Response::HTTP_NO_CONTENT`

---

## 5. Épica 3 — Autenticación y Autorización

> **Prioridad:** 🔴 Crítica — La API es completamente abierta sin protección.
> **Esfuerzo estimado:** 8-12 horas
> **Dependencias:** Ninguna

### Task 3.1: Instalar y configurar Laravel Sanctum

**Archivos:**
- Ejecutar: `composer require laravel/sanctum`
- Publicar config: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
- Modificar: `src/config/auth.php` — agregar guard `api` con driver `sanctum`
- Modificar: `src/app/Models/User.php` — agregar trait `HasApiTokens`
- Migración: ejecutar `php artisan migrate`

---

### Task 3.2: Crear middleware de autenticación para rutas API

**Archivos:**
- Modificar: `src/bootstrap/app.php`
- Modificar: Todos los `src/routes/v1/*.php`

**Implementación:**
```php
// En cada archivo de rutas, envolver con middleware:
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    // ... rutas existentes
});
```

**Nota:** Considerar hacer algunos endpoints públicos (solo lectura para catálogo):
- `GET /v1/catalog/*` → público
- `POST/PUT/DELETE /*` → requiere autenticación

---

### Task 3.3: Crear endpoints de autenticación

**Archivos:**
- Crear: `src/app/Http/Controllers/Auth/LoginController.php`
- Crear: `src/app/Http/Controllers/Auth/RegisterController.php`
- Crear: `src/app/Http/Controllers/Auth/TokenController.php`
- Modificar: `src/routes/api.php` — agregar rutas auth

**Endpoints:**
```
POST /api/v1/auth/login      → Obtener token
POST /api/v1/auth/register   → Registrar usuario
POST /api/v1/auth/logout     → Revocar token
GET  /api/v1/auth/me          → Usuario autenticado
```

---

### Task 3.4: Implementar lógica real en Policies

**Archivos:**
- Modificar: Todos los 39 archivos en `src/app/Policies/`

**Contexto:** Actualmente todas retornan `true`. Implementar lógica basada en roles:
- **admin** → Todo
- **editor** → CRUD en su dominio
- **viewer** → Solo lectura

**Nota:** Requiere primero definir un sistema de roles (puede ser simple con un campo `role` en `users` o más complejo con `spatie/laravel-permission`).

> //TODO:
> Implementar tabla `roles` si no existe, y mediante relación asignar usuarios al rol.

---

### Task 3.5: Actualizar `authorize()` en Form Requests

**Archivos:**
- Modificar: Todos los 76 Form Request files en `src/app/Http/Requests/`

**Contexto:** Actualmente todos retornan `true`. Deben verificar permisos del usuario autenticado usando las Policies correspondientes.

---

## 6. Épica 4 — Feature Tests para API Endpoints

> **Prioridad:** 🔴 Crítica — 0 tests de integración para la API.
> **Esfuerzo estimado:** 20-30 horas
> **Dependencias:** Épica 1 (rutas corregidas), Épica 3 (auth, para test auth)

### Task 4.1: Crear test base / helper

**Archivos:**
- Crear: `src/tests/Feature/ApiTestCase.php`

**Contexto:** Base class para todos los feature tests:
```php
abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;
    
    protected User $user;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }
    
    protected function apiAs(User $user): static
    {
        return $this->actingAs($user);
    }
}
```

---

### Task 4.2: Feature tests para dominio Catalog — Components

**Archivos:**
- Crear: `src/tests/Feature/Catalog/ComponentControllerTest.php`

**Tests a implementar:**
```
- can list components (GET /v1/catalog/components)
- can create a component (POST /v1/catalog/components)
- can show a component by slug (GET /v1/catalog/components/{slug})
- can update a component (PUT /v1/catalog/components/{slug})
- can delete a component (DELETE /v1/catalog/components/{slug})
- can eager-load relationships with ?with= parameter
- validates required fields on create
- returns 404 for non-existent component
- returns 422 for invalid data
- returns paginated results
```

---

### Task 4.3: Feature tests para dominio Catalog — APIs

**Archivos:**
- Crear: `src/tests/Feature/Catalog/ApiControllerTest.php`

**Misma estructura que Task 4.2, adaptada para el modelo Api.**

---

### Task 4.4–4.15: Feature tests para todos los dominios

Crear feature tests para cada controller principal. Orden sugerido por prioridad:

| # | Archivo de test | Controller |
|---|---|---|
| 4.4 | `Feature/Catalog/ApiControllerTest.php` | ApiController |
| 4.5 | `Feature/Architecture/SystemControllerTest.php` | SystemController |
| 4.6 | `Feature/Architecture/EntityControllerTest.php` | EntityController |
| 4.7 | `Feature/Architecture/BusinessDomainControllerTest.php` | BusinessDomainController |
| 4.8 | `Feature/Infrastructure/ClusterControllerTest.php` | ClusterController |
| 4.9 | `Feature/Infrastructure/NodeControllerTest.php` | NodeController |
| 4.10 | `Feature/Organization/GroupControllerTest.php` | GroupController |
| 4.11 | `Feature/Organization/UserControllerTest.php` | UserController |
| 4.12 | `Feature/Security/ServiceAccountControllerTest.php` | ServiceAccountController |
| 4.13 | `Feature/CiCd/ReleaseControllerTest.php` | ReleaseController |
| 4.14 | `Feature/CiCd/WorkflowRunControllerTest.php` | WorkflowRunController |
| 4.15 | `Feature/Operations/DeploymentControllerTest.php` | DeploymentController |

**Cada archivo debe cubrir:**
1. CRUD completo (index, store, show, update, destroy)
2. Validación de request (campos requeridos, formatos)
3. Status codes correctos (200, 201, 204, 404, 422)
4. Paginación
5. Eager-loading con `?with=`

---

### Task 4.16: Feature tests para lookup/catalog controllers menores

**Archivos:** Tests para los controllers de datos de referencia:

| Controller | Test |
|---|---|
| ApiTypeController | `Feature/Catalog/ApiTypeControllerTest.php` |
| ApiStatusController | `Feature/Catalog/ApiStatusControllerTest.php` |
| ApiCategoryController | `Feature/Catalog/ApiCategoryControllerTest.php` |
| EnvironmentController | `Feature/Catalog/EnvironmentControllerTest.php` |
| FrameworkController | `Feature/Catalog/FrameworkControllerTest.php` |
| PlatformController | `Feature/Catalog/PlatformControllerTest.php` |
| LifecyclePhaseController | `Feature/Architecture/LifecyclePhaseControllerTest.php` |
| BusinessTierController | `Feature/Architecture/BusinessTierControllerTest.php` |
| ComponentTypeController | `Feature/Catalog/ComponentTypeControllerTest.php` |
| ProgrammingLanguageController | `Feature/Catalog/ProgrammingLanguageControllerTest.php` |
| VendorController | `Feature/Infrastructure/VendorControllerTest.php` |
| ClusterTypeController | `Feature/Infrastructure/ClusterTypeControllerTest.php` |
| InfrastructureTypeController | `Feature/Infrastructure/InfrastructureTypeControllerTest.php` |
| ComplianceStandardController | `Feature/Compliance/ComplianceStandardControllerTest.php` |
| ServiceStatusController | `Feature/Operations/ServiceStatusControllerTest.php` |
| AuthenticationMethodController | `Feature/Security/AuthenticationMethodControllerTest.php` |

---

## 7. Épica 5 — Búsqueda, Filtrado y Ordenamiento

> **Prioridad:** 🟠 Media — Funcionalidad clave para usabilidad de la API.
> **Esfuerzo estimado:** 8-12 horas
> **Dependencias:** Ninguna (puede hacerse en paralelo a otras épicas)

### Task 5.1: Crear trait `Filterable`

**Archivos:**
- Crear: `src/app/Traits/Filterable.php`
- Test: `src/tests/Unit/Traits/FilterableTest.php`

**Implementación propuesta:**
```php
trait Filterable
{
    public function scopeFilter(Builder $query, Request $request): Builder
    {
        // Soportar ?filter[field]=value
        if ($filters = $request->get('filter')) {
            foreach ($filters as $field => $value) {
                if (in_array($field, $this->filterable ?? [])) {
                    $query->where($field, $value);
                }
            }
        }
        return $query;
    }
}
```

---

### Task 5.2: Crear trait `Sortable`

**Archivos:**
- Crear: `src/app/Traits/Sortable.php`
- Test: `src/tests/Unit/Traits/SortableTest.php`

**Soportar:** `?sort=name` (asc) y `?sort=-name` (desc)

---

### Task 5.3: Crear trait `Searchable`

**Archivos:**
- Crear: `src/app/Traits/Searchable.php`
- Test: `src/tests/Unit/Traits/SearchableTest.php`

**Soportar:** `?search=term` — búsqueda por campos definidos en `$searchable` del modelo.

---

### Task 5.4: Integrar traits en modelos principales

**Modelos a actualizar:**
- `Component` → filterable: `domain_id`, `platform_id`, `status_id`, `tier_id`, `is_exposed`, `is_stateless`; searchable: `name`, `display_name`, `description`
- `Api` → filterable: `status_id`, `type_id`, `category_id`, `protocol`, `access_policy`; searchable: `name`, `display_name`, `description`
- `System` → filterable: `owner_id`; searchable: `name`, `display_name`, `description`
- `Cluster` → filterable: `type_id`, `vendor_id`, `infrastructure_type_id`; searchable: `name`, `display_name`
- `Entity` → filterable: `domain_id`; searchable: `name`, `display_name`, `description`

---

### Task 5.5: Actualizar controllers para usar filter/sort/search

**Ejemplo de patrón:**
```php
public function index(Request $request): ComponentResourceCollection
{
    $query = Component::query()
        ->filter($request)
        ->search($request)
        ->sort($request);
    
    return new ComponentResourceCollection($query->paginate());
}
```

---

## 8. Épica 6 — Seeders Faltantes

> **Prioridad:** 🟡 Baja — Datos de prueba para desarrollo.
> **Esfuerzo estimado:** 4-6 horas
> **Dependencias:** Ninguna

### Task 6.1: Crear seeders faltantes

**Archivos a crear:**

| Seeder | Datos |
|---|---|
| `ClusterSeeder.php` | 3-5 clusters de ejemplo (EKS, GKE, OpenShift) con tipos y vendors |
| `NodeSeeder.php` | 10-15 nodos distribuidos en clusters |
| `LinkSeeder.php` | 5-10 links entre componentes |
| `ServiceAccountSeeder.php` | 3-5 service accounts con tokens |
| `ReleaseSeeder.php` | 5-10 releases asociados a componentes |
| `DeploymentSeeder.php` | 10-20 deployments en diferentes environments |
| `WorkflowRunSeeder.php` | 5-10 workflow runs con jobs y commits |
| `SystemSeeder.php` | 3-5 systems agrupando componentes |
| `LinkCategorySeeder.php` | Categorías de links (Documentation, Repository, Dashboard, CI/CD, Monitoring) |
| `ResourceCategorySeeder.php` | Categorías de resources si no existen |
| `UserSeeder.php` | 5-10 usuarios de ejemplo con diferentes roles |

> //TODO: Hay que distinguir entre seeders para añadir datos de ejemplo que se realizaría con `Factory` y los seeders que hay implementados que son para rellenar datos básicos de la aplicación.
> Se pueden crear seeders para la aplicación y seeders para datos de ejemplo.

---

### Task 6.2: Actualizar DatabaseSeeder para incluir los nuevos seeders

**Archivos:**
- Modificar: `src/database/seeders/DatabaseSeeder.php`

Agregar una tercera fase de seeders que dependan de modelos ya creados.

---

## 9. Épica 7 — Rate Limiting y Middleware

> **Prioridad:** 🟠 Media — Protección básica de la API.
> **Esfuerzo estimado:** 2-3 horas
> **Dependencias:** Épica 3 (autenticación)

### Task 7.1: Configurar Rate Limiting

**Archivos:**
- Modificar: `src/app/Providers/AppServiceProvider.php`
- Modificar: `src/bootstrap/app.php`

**Implementación:**
```php
// AppServiceProvider::boot()
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});
```

```php
// bootstrap/app.php — añadir al middleware de api
->withMiddleware(function (Middleware $middleware): void {
    $middleware->use([
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
    $middleware->api([
        'throttle:api',
    ]);
})
```

---

### Task 7.2: Crear middleware `ForceJsonResponse`

**Archivos:**
- Crear: `src/app/Http/Middleware/ForceJsonResponse.php`
- Modificar: `src/bootstrap/app.php`

**Contexto:** Asegurar que todas las respuestas API sean JSON, incluso errores de Laravel (404, 500, etc.).

---

### Task 7.3: Mejorar configuración CORS

**Archivos:**
- Modificar: `src/config/cors.php`

**Cambios:**
- `max_age` → `86400` (24h cache de preflight)
- `supports_credentials` → `true` (si se usa cookie-based auth)
- Mover orígenes hardcoded a variables de entorno

---

## 10. Épica 8 — Service Layer (Refactor Opcional)

> **Prioridad:** 🟡 Baja — Mejora arquitectural, no bloquea funcionalidad.
> **Esfuerzo estimado:** 15-20 horas
> **Dependencias:** Todas las demás épicas completadas

### Task 8.1: Crear Service classes para controllers con lógica compleja

**Contexto:** Solo tiene sentido para controllers que tienen lógica más allá del CRUD simple. Candidatos:

| Service | Controller | Lógica |
|---|---|---|
| `DeploymentService` | `DeploymentController` | Cálculo de duración, merge de meta, lógica de timestamps |
| `ComponentService` | `ComponentController` | Futuro: validación de lifecycle transitions, dependency checks |
| `ApiService` | `ApiController` | Futuro: validación de spec, deprecation workflow |

**Para la mayoría de controllers que hacen CRUD puro, NO crear services** — sería over-engineering.

> //TODO:
> Está previsto el uso de caché con Valkey o Memcached. De forma ideal, cualquiera que tenga una UI para la consulta de los datos almacenados en la caché.

---

## 11. Épica 9 — Sincronización de API Spec

> **Prioridad:** 🟠 Media — Documentación precisa de la API.
> **Esfuerzo estimado:** 4-6 horas
> **Dependencias:** Épica 1 (rutas corregidas)

### Task 9.1: Decidir entre spec manual vs Scramble auto-gen

**Contexto:** El proyecto tiene DOS fuentes de verdad para la API spec:
1. `docs/api/v1.0.0.yml` — spec manual OpenAPI 3.0.3
2. Scramble (`/docs/api`) — auto-generado desde el código

**Opciones:**
- **Opción A (recomendada):** Eliminar el spec manual y confiar en Scramble. Scramble analiza controllers, form requests y resources para generar el spec automáticamente.
- **Opción B:** Mantener ambos pero marcar uno como fuente de verdad.

> //TODO:
> Eliminar el spec manual y confiar en Scramble. Si es necesario "compro" la versión pro.

---

### Task 9.2: Mejorar anotaciones para Scramble

**Archivos:** Todos los controllers

**Contexto:** Scramble infiere tipos del código, pero se puede mejorar con:
- PHPDoc `@response` tags en controllers
- `@operationId` tags
- `@tag` annotations

---

### Task 9.3: Agregar al spec los recursos faltantes

**Recursos implementados pero no documentados en `v1.0.0.yml`:**
- Components (`/v1/catalog/components`)
- Systems (`/v1/architecture/systems`)
- Entities + EntityAttributes (`/v1/architecture/entities`)
- Business Capabilities (`/v1/architecture/business-capabilities`)
- Deployments (cuando se registren rutas)
- Releases (`/v1/ci-cd/releases`)
- Workflow Runs/Jobs/Commits (`/v1/ci-cd/workflows/*`)
- Users (`/v1/organization/users`)
- Compliance Standards (`/v1/compliance/compliance-standards`)
- Service Account Tokens (`/v1/security/service-accounts/tokens`)
- Service Statuses (`/v1/operations/service-statuses`)
- Service Models (`/v1/catalog/service-models`)
- Component Types (`/v1/catalog/components/types`)
- Link Categories (`/v1/catalog/links/categories`)
- Resource Categories (`/v1/catalog/resources/categories`)

---

## 12. Épica 10 — Tests Unitarios Faltantes

> **Prioridad:** 🟡 Baja — Cobertura incremental.
> **Esfuerzo estimado:** 3-4 horas
> **Dependencias:** Ninguna

### Task 10.1: Tests para traits faltantes

**Archivos a crear:**

| Trait | Test |
|---|---|
| `AllowedRelationships` | `tests/Unit/Traits/AllowedRelationshipsTest.php` |
| `BelongsToUser` | `tests/Unit/Traits/BelongsToUserTest.php` |
| `BelongsToUserState` | `tests/Unit/Traits/BelongsToUserStateTest.php` |
| `HasDeployments` | `tests/Unit/Traits/HasDeploymentsTest.php` |
| `HasIcon` | `tests/Unit/Traits/HasIconTest.php` |
| `HasRelatives` | `tests/Unit/Traits/HasRelativesTest.php` |

---

### Task 10.2: Test para DeploymentStatus enum

**Archivos:**
- Crear: `tests/Unit/Enums/DeploymentStatusTest.php`

---

## 13. Priorización y Roadmap

### Fase 1 — Estabilización (Semana 1)
> Corregir lo que está roto y evitar errores 500.

| Task | Épica | Esfuerzo |
|---|---|---|
| 1.1 | Rutas Rotas | 30 min |
| 1.2 | Rutas Rotas | 30 min |
| 1.3 | Rutas Rotas | 30 min |
| 1.4 | Rutas Rotas | 30 min |
| 1.5 | Rutas Rotas | 1h |
| 2.1 | Consistencia | 1h |
| 2.2 | Consistencia | 30 min |
| 2.3 | Consistencia | 15 min |
| 2.4 | Consistencia | 1h |

**Total Fase 1:** ~6 horas

---

### Fase 2 — Seguridad (Semana 2)
> Proteger la API contra acceso no autorizado.

| Task | Épica | Esfuerzo |
|---|---|---|
| 3.1 | Auth | 2h |
| 3.2 | Auth | 1h |
| 3.3 | Auth | 3h |
| 7.1 | Rate Limiting | 1h |
| 7.2 | Middleware | 1h |
| 7.3 | CORS | 30 min |

**Total Fase 2:** ~8.5 horas

---

### Fase 3 — Testing (Semanas 3-4)
> Garantizar que la API funciona y no regresiona.

| Task | Épica | Esfuerzo |
|---|---|---|
| 4.1 | Feature Tests | 1h |
| 4.2 | Feature Tests | 2h |
| 4.3-4.15 | Feature Tests | 15h |
| 4.16 | Feature Tests | 5h |
| 10.1-10.2 | Unit Tests | 3h |

**Total Fase 3:** ~26 horas

---

### Fase 4 — Funcionalidades (Semana 5)
> Búsqueda, filtrado, y datos de prueba.

| Task | Épica | Esfuerzo |
|---|---|---|
| 5.1-5.3 | Search/Filter/Sort | 4h |
| 5.4-5.5 | Integración | 4h |
| 6.1-6.2 | Seeders | 4h |

**Total Fase 4:** ~12 horas

---

### Fase 5 — Documentación y Pulido (Semana 6)
> Spec actualizado y mejoras arquitecturales opcionales.

| Task | Épica | Esfuerzo |
|---|---|---|
| 3.4-3.5 | Policies reales | 4h |
| 9.1-9.3 | API Spec | 4h |
| 8.1 | Service Layer | 4h (opcional) |

**Total Fase 5:** ~8-12 horas

---

### Resumen del Roadmap

| Fase | Semana | Foco | Horas |
|---|---|---|---|
| 1 — Estabilización | 1 | Rutas rotas + consistencia | ~6h |
| 2 — Seguridad | 2 | Auth + rate limiting + middleware | ~8.5h |
| 3 — Testing | 3-4 | Feature tests + unit tests | ~26h |
| 4 — Funcionalidades | 5 | Search/filter + seeders | ~12h |
| 5 — Documentación | 6 | API spec + policies + services | ~8-12h |
| **TOTAL** | | | **~60-64h** |

---

## Apéndice A: Diagrama de Dependencias entre Épicas

```
Épica 1 (Rutas Rotas) ──────────┐
                                 ├──→ Épica 4 (Feature Tests)
Épica 2 (Consistencia) ─────────┘
                                       │
Épica 3 (Auth) ──→ Épica 7 (Rate Limit)
      │                                │
      └──→ Épica 4 (Feature Tests auth)│
                                       │
Épica 5 (Search/Filter) ──── independiente
                                       │
Épica 6 (Seeders) ──── independiente   │
                                       │
Épica 9 (API Spec) ← Épica 1          │
                                       │
Épica 10 (Unit Tests) ──── independiente
                                       │
Épica 8 (Service Layer) ← TODAS ──────┘
```

---

## Apéndice B: Archivos Clave por Referencia

| Archivo | Propósito |
|---|---|
| `src/bootstrap/app.php` | Middleware global, routing, exceptions |
| `src/routes/api.php` | Include de todos los archivos de rutas por dominio |
| `src/routes/v1/*.php` | Definiciones de rutas por dominio |
| `src/config/auth.php` | Configuración de autenticación |
| `src/config/cors.php` | Configuración CORS |
| `src/config/scramble.php` | Configuración de Scramble (auto-gen OpenAPI) |
| `src/phpunit.xml` | Configuración de PHPUnit (usa SQLite in-memory) |
| `src/app/Providers/AppServiceProvider.php` | Lugar para rate limiting, bindings, etc. |
| `docs/api/v1.0.0.yml` | API spec manual (desincronizado) |

---

*Plan generado el 4 de marzo de 2026 — Branch: `analysis/backend-implementation-plan`*
