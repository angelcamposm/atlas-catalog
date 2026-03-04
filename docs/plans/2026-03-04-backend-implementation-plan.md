# Backend Implementation Plan — Atlas Catalog

> **Para Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans para implementar este plan task-by-task.

**Fecha:** 4 de marzo de 2026

**Goal:** Completar la implementación del backend Laravel, cerrando todas las brechas identificadas en autenticación, testing, consistencia de controllers, búsqueda/filtrado, y documentación de API.

**Arquitectura:** Backend API REST con Laravel 12 + PHP 8.4, PostgreSQL, Redis. Organización por dominios (catalog, infrastructure, architecture, organization, security, compliance, operations, ci-cd). Controllers RESTful con API Resources, Form Requests, Policies y Observers.

**Tech Stack:** PHP 8.4, Laravel 12, PHPUnit 12, PostgreSQL, Valkey/Redis, Scramble (OpenAPI auto-gen), Sanctum (API auth)

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
10. [Épica 8 — Service Layer y Caché](#10-épica-8--service-layer-y-caché)
11. [Épica 9 — Documentación API con Scramble](#11-épica-9--documentación-api-con-scramble)
12. [Épica 10 — Tests Unitarios Faltantes](#12-épica-10--tests-unitarios-faltantes)
13. [Épica 11 — Sistema de Eventos Recientes y Webhooks](#13-épica-11--sistema-de-eventos-recientes-y-webhooks)
14. [Priorización y Roadmap (Actualizado con TODOs)](#14-priorización-y-roadmap-actualizado-con-todos)
15. [Apéndice A: Diagrama de Dependencias](#apéndice-a-diagrama-de-dependencias-entre-épicas-actualizado)
16. [Apéndice B: Archivos Clave](#apéndice-b-archivos-clave-por-referencia-actualizado)
17. [Apéndice C: Paquetes Nuevos Requeridos](#apéndice-c-paquetes-nuevos-requeridos)

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

### Task 1.3: Registrar rutas para DeploymentController (Webhook + Consulta)

**Archivos:**
- Crear: `src/routes/v1/webhooks.php`
- Modificar: `src/routes/v1/ci-cd.php` (añadir rutas de lectura)
- Modificar: `src/routes/api.php` (incluir webhooks.php)

**Contexto:** El `DeploymentController` tiene un **doble propósito** que debe reflejarse en la arquitectura de rutas:

1. **Ingesta de datos (Webhook):** Recibe un `POST` con el payload de una ejecución de workflowRun desde Jenkins. Este endpoint debe vivir en un dominio de webhooks dedicado, protegido por token/secret (no por sesión de usuario).
2. **Consulta de datos (API REST):** La información de deployments se expone vía relaciones en modelos (`Component->deployments`, `Release->deployments`) y también en un endpoint directo para consultar los últimos eventos.

**Implementación:**

```php
// routes/v1/webhooks.php — Endpoints de ingesta (protección por token)
Route::prefix('v1/webhooks')->middleware(['throttle:webhooks'])->group(function () {
    Route::post('deployments', [DeploymentController::class, 'store'])
        ->name('webhooks.deployments.store');
});
```

```php
// routes/v1/ci-cd.php — Endpoints de consulta (protección por auth:sanctum)
Route::prefix('ci-cd')->group(function () {
    // ... rutas existentes ...
    Route::get('deployments', [DeploymentController::class, 'index'])
        ->name('deployments.index');
    Route::get('deployments/{deployment}', [DeploymentController::class, 'show'])
        ->name('deployments.show');
    Route::put('deployments/{deployment}', [DeploymentController::class, 'update'])
        ->name('deployments.update');
});
```

**Subtasks:**

| # | Subtask | Esfuerzo |
|---|---------|----------|
| 1.3.1 | Crear `routes/v1/webhooks.php` con `POST /v1/webhooks/deployments` | 30 min |
| 1.3.2 | Añadir rutas GET de lectura en `ci-cd.php` | 15 min |
| 1.3.3 | Crear middleware `VerifyWebhookToken` para proteger webhooks con secret | 1h |
| 1.3.4 | Crear rate limiter específico `webhooks` (más permisivo que `api`) | 15 min |
| 1.3.5 | Definir variable de entorno `WEBHOOK_SECRET` en `.env.example` | 5 min |

**Impacto en Épica 2 (Task 2.1):** El refactor de DeploymentController debe tener en cuenta este doble propósito — ver Task 2.1 actualizada.

**Impacto futuro — Sistema de Eventos Recientes:**
El TODO menciona "últimos eventos (deployments, builds, actualizaciones)". Esto implica un futuro endpoint tipo:
```
GET /v1/events/recent → últimos N eventos cross-domain
```
Esto requeriría un modelo `Event` polimórfico o una vista que agregue deployments + builds + releases. **Aplazar a Épica 11 (nueva).**

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

### Task 2.1: Refactorizar DeploymentController — Separar Webhook de CRUD

**Archivos:**
- Modificar: `src/app/Http/Controllers/DeploymentController.php`
- Crear: `src/app/Http/Controllers/Webhooks/DeploymentWebhookController.php`
- Crear: `src/app/Rules/ValidJsonSchema.php` (o instalar paquete)
- Modificar: `src/app/Http/Requests/StoreDeploymentRequest.php`

**Contexto del TODO:** El payload de Jenkins es JSON dinámico/semiestructurado. Las reglas de validación estándar de Laravel (`required`, `string`, `exists`) no son suficientes para validar un schema JSON arbitrario que pueda cambiar según el CI. Se necesita validación por **JSON Schema**.

**Cambios necesarios:**

#### 2.1.1: Extraer webhook a controller dedicado
```php
// app/Http/Controllers/Webhooks/DeploymentWebhookController.php
class DeploymentWebhookController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        // Validar contra JSON Schema (payload de Jenkins)
        $validator = new JsonSchemaValidator();
        $validator->validate($request->all(), $this->getSchema());
        
        if (!$validator->isValid()) {
            return response()->json(['errors' => $validator->getErrors()], 422);
        }
        
        // Mapear payload de Jenkins → modelo Deployment
        $deployment = DeploymentService::createFromWebhook($request->all());
        return new DeploymentResource($deployment);
    }
    
    private function getSchema(): string
    {
        return storage_path('schemas/deployment-webhook.json');
    }
}
```

#### 2.1.2: Crear JSON Schema para validación del webhook
```
src/storage/schemas/deployment-webhook.json
```
Definir el schema del payload de Jenkins: campos requeridos, tipos, formatos.

#### 2.1.3: Refactorizar DeploymentController (CRUD puro)
1. Reemplazar `__invoke()` por `index()` estándar
2. Usar `DeploymentResource`/`DeploymentResourceCollection` en TODAS las respuestas
3. Agregar método `destroy()` faltante
4. Agregar trait `AllowedRelationships`: `component`, `environment`, `cluster`, `release`, `workflowRun`, `triggerer`
5. **Eliminar lógica de timestamps/duración** del controller → mover a `DeploymentService` (ver Épica 8)

#### 2.1.4: Opciones de validación JSON Schema
| Opción | Paquete | Pros | Contras |
|--------|---------|------|---------|
| **A (recomendada)** | `opis/json-schema` | PHP nativo, sin deps extra, buen mantenimiento | Más manual |
| **B** | `swaggest/json-schema` | Más completo, PHP 8.4 compatible | Más pesado |
| **C** | Custom Laravel Rule | Sin paquete extra, usa `Illuminate\Validation\Rule` | Limitado para schemas complejos |

**Esfuerzo estimado:** 3h (era 1h antes del TODO)

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

**Nota:** Requiere primero definir un sistema de roles.

**Estado actual del código:**
- `User` model NO tiene campo `role` ni relación a roles.
- NO existe tabla `roles` ni migración asociada.
- NO hay paquete de permisos instalado (`spatie/laravel-permission` no está en composer.json).

#### Decisión de implementación: Tabla `roles` propia (sin Spatie)

El TODO indica implementar tabla `roles` con relación. Dado que el proyecto necesita solo 3 roles fijos (admin/editor/viewer), Spatie sería over-engineering. Se implementa así:

**Subtasks:**

| # | Subtask | Esfuerzo |
|---|---------|----------|
| 3.4.1 | Crear migración `create_roles_table` con campos: `id`, `name`, `slug`, `description`, timestamps | 15 min |
| 3.4.2 | Crear migración `add_role_id_to_users_table` con foreign key `role_id` → `roles.id` | 15 min |
| 3.4.3 | Crear modelo `Role` con relación `users(): HasMany` | 15 min |
| 3.4.4 | Añadir relación `role(): BelongsTo` en `User` model + helpers `isAdmin()`, `isEditor()`, `isViewer()` | 30 min |
| 3.4.5 | Crear `RoleSeeder` con los 3 roles base (admin, editor, viewer) | 15 min |
| 3.4.6 | Actualizar `DatabaseSeeder` → asignar rol admin al usuario de ejemplo | 10 min |
| 3.4.7 | Implementar lógica real en las 39 Policies usando `$user->isAdmin()` etc. | 2h |
| 3.4.8 | Tests unitarios para Role model + helpers en User | 30 min |

**Esquema de migración:**
```php
// create_roles_table
Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('name');         // "Administrador", "Editor", "Viewer"
    $table->string('slug')->unique(); // "admin", "editor", "viewer"
    $table->text('description')->nullable();
    $table->timestamps();
});

// add_role_id_to_users_table
Schema::table('users', function (Blueprint $table) {
    $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
});
```

**Lógica de Policies:**
```php
// Patrón base para todas las Policies:
public function viewAny(User $user): bool {
    return true; // Lectura pública o autenticado
}
public function create(User $user): bool {
    return $user->isAdmin() || $user->isEditor();
}
public function update(User $user, Model $model): bool {
    return $user->isAdmin() || $user->isEditor();
}
public function delete(User $user, Model $model): bool {
    return $user->isAdmin();
}
```

**Esfuerzo total Task 3.4:** ~4h (era "4h" genérico, ahora detallado en 8 subtasks)

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

#### Distinción entre tipos de seeders

El TODO establece una separación arquitectónica importante. Los 24 seeders existentes son **seeders de aplicación** (datos base). Los nuevos deben seguir esta convención:

| Tipo | Propósito | Cuándo ejecutar | Cómo generar datos | Directorio |
|------|-----------|----------------|-------------------|------------|
| **Seeders de Aplicación** | Datos base que la app necesita para funcionar (tipos, categorías, estados, roles) | `php artisan migrate --seed` (siempre) | Datos hardcoded en el seeder, idempotentes (`firstOrCreate`) | `database/seeders/` |
| **Seeders de Ejemplo** | Datos ficticios para desarrollo/demo (componentes, clusters, deployments, usuarios) | `php artisan db:seed --class=ExampleDataSeeder` (solo dev) | Usarlos con `Factory::count(N)->create()` | `database/seeders/examples/` |

**Seeders de Aplicación** (ya existentes + nuevos):
- ✅ Los 24 existentes (`ComponentTypeSeeder`, `EnvironmentSeeder`, etc.)
- 🆕 `RoleSeeder` → admin, editor, viewer (ver Task 3.4.5)
- 🆕 `LinkCategorySeeder` → Documentation, Repository, Dashboard, CI/CD, Monitoring
- 🆕 `ResourceCategorySeeder` → si no existe ya

**Seeders de Ejemplo** (nuevos, usando Factories):
| Seeder | Factory usada | Cantidad |
|--------|--------------|----------|
| `ExampleUserSeeder` | `UserFactory` | 5-10 usuarios con roles variados |
| `ExampleClusterSeeder` | `ClusterFactory` | 3-5 clusters |
| `ExampleNodeSeeder` | `NodeFactory` | 10-15 nodos |
| `ExampleSystemSeeder` | `SystemFactory` | 3-5 systems |
| `ExampleDeploymentSeeder` | `DeploymentFactory` | 10-20 deployments |
| `ExampleReleaseSeeder` | `ReleaseFactory` | 5-10 releases |
| `ExampleWorkflowRunSeeder` | `WorkflowRunFactory` | 5-10 runs |
| `ExampleLinkSeeder` | `LinkFactory` | 5-10 links |
| `ExampleServiceAccountSeeder` | `ServiceAccountFactory` | 3-5 accounts |

**Estructura de directorios:**
```
database/seeders/
├── DatabaseSeeder.php          # Orquestador principal
├── RoleSeeder.php              # 🆕 Aplicación
├── LinkCategorySeeder.php      # 🆕 Aplicación
├── ComponentTypeSeeder.php     # Existente
├── ...                         # 23 seeders existentes
└── examples/                   # 🆕 Directorio para datos de ejemplo
    ├── ExampleDataSeeder.php   # Orquestador de ejemplos
    ├── ExampleUserSeeder.php
    ├── ExampleClusterSeeder.php
    └── ...                     # 9 seeders de ejemplo
```

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

### Task 8.2: Implementar Capa de Caché con Valkey/Memcached

> **Prioridad:** 🟡 Baja → 🟠 Media (por TODO del owner)
> **Esfuerzo estimado:** 6-10 horas
> **Dependencias:** Task 8.1 (Service Layer para encapsular cache logic)

**Contexto del TODO:** Está previsto el uso de caché con Valkey o Memcached, idealmente con UI para consultar los datos cacheados.

**Estado actual:**
- `config/cache.php` tiene `database` como store por defecto y `redis` como opción configurada.
- `laravel/horizon` ya está instalado (dashboard para Redis/queues).
- No hay estrategia de caché implementada en ningún controller.

**Decisión: Valkey como cache driver**

Valkey (fork de Redis mantenido por Linux Foundation) es compatible wire-protocol con Redis, así que el driver `redis` de Laravel funciona sin cambios. Solo se necesita apuntar la conexión a un servidor Valkey.

#### Subtasks

| # | Subtask | Esfuerzo |
|---|---------|----------|
| 8.2.1 | Configurar `CACHE_STORE=redis` en `.env.example` y apuntar a Valkey | 15 min |
| 8.2.2 | Añadir servicio `valkey` en `docker-compose.dev.yml` (imagen `valkey/valkey:8`) | 30 min |
| 8.2.3 | Implementar cache en `ComponentController::index()` como patrón piloto | 1h |
| 8.2.4 | Crear trait `CachesResponses` para reutilizar en controllers de lectura intensiva | 2h |
| 8.2.5 | Invalidar cache en Observers (ya existentes) en `created`/`updated`/`deleted` | 2h |
| 8.2.6 | Configurar UI de monitorización de caché | 1h |
| 8.2.7 | Tests de integración para comportamiento de cache | 2h |

#### Patrón de cache en controllers
```php
// Trait CachesResponses
public function cachedIndex(Request $request, string $cacheKey, Builder $query): ResourceCollection
{
    $ttl = config('cache.api_ttl', 300); // 5 min default
    return Cache::remember(
        $cacheKey . ':' . md5($request->fullUrl()),
        $ttl,
        fn() => new static::$resourceCollection($query->paginate())
    );
}
```

#### Invalidación via Observers (ya existentes)
```php
// En ComponentObserver (ya existe, añadir):
public function created(Component $component): void {
    Cache::tags(['components'])->flush();
}
```

#### UI de monitorización de caché
| Opción | Herramienta | Pros | Contras |
|--------|-------------|------|---------|
| **A (recomendada)** | Redis Insight (ya en docker-compose) | Ya configurado, UI completa, gratis | Solo Redis/Valkey |
| **B** | Laravel Horizon `/horizon` | Ya instalado, muestra jobs+redis | No muestra cache keys directamente |
| **C** | Pulse (`laravel/pulse`) | Dashboard nativo Laravel, muestra cache hit/miss | Requiere instalación adicional |

**Recomendación:** Usar **Redis Insight** (ya presente en `docker-compose.yml`) para inspección directa de keys, y evaluar **Laravel Pulse** para métricas de cache hit rate.

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
- ~~**Opción A (recomendada):** Eliminar el spec manual y confiar en Scramble.~~
- ~~**Opción B:** Mantener ambos pero marcar uno como fuente de verdad.~~

**✅ Decisión tomada (por owner):** Eliminar el spec manual y confiar en Scramble. Se evaluará Scramble Pro si las funcionalidades free no cubren las necesidades.

#### Subtasks

| # | Subtask | Esfuerzo |
|---|---------|----------|
| 9.1.1 | Eliminar `docs/api/v1.0.0.yml` del repositorio | 5 min |
| 9.1.2 | Actualizar referencias al spec manual en README y docs | 15 min |
| 9.1.3 | Verificar que Scramble genera correctamente TODOS los endpoints actuales | 1h |
| 9.1.4 | Documentar URL de Scramble (`/docs/api`) en README como fuente de verdad | 15 min |
| 9.1.5 | Evaluar si Scramble Free cubre: auth docs, response examples, webhooks | 30 min |
| 9.1.6 | Si Scramble Free no cubre webhooks → evaluar Scramble Pro (`dedoc/scramble-pro`) | Decisión |

**Funcionalidades de Scramble Free vs Pro:**
| Feature | Free | Pro |
|---------|------|-----|
| Auto-gen desde controllers/requests/resources | ✅ | ✅ |
| Agrupación por tags | ✅ | ✅ |
| Response examples | ❌ Manual | ✅ Auto |
| Webhooks documentation | ❌ | ✅ |
| API versioning | ❌ | ✅ |
| Custom UI themes | ❌ | ✅ |

**Dado que el proyecto necesita documentar webhooks (Task 1.3), Scramble Pro es recomendable.**

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

## 13. Épica 11 — Sistema de Eventos Recientes y Webhooks (Nueva)

> **Prioridad:** 🟡 Baja — Funcionalidad futura derivada del TODO de Task 1.3.
> **Esfuerzo estimado:** 12-16 horas
> **Dependencias:** Épica 1 (rutas webhook), Épica 2 (DeploymentController refactorizado), Épica 3 (auth)

**Contexto:** El TODO de Task 1.3 menciona "últimos eventos (deployments, builds, actualizaciones, etc.)". Esto implica un sistema transversal que agregue actividad de múltiples dominios.

### Task 11.1: Diseñar modelo `ActivityEvent` polimórfico

**Archivos:**
- Crear: migración `create_activity_events_table`
- Crear: `src/app/Models/ActivityEvent.php`

**Esquema propuesto:**
```php
Schema::create('activity_events', function (Blueprint $table) {
    $table->id();
    $table->string('type');              // 'deployment', 'release', 'build', 'update'
    $table->morphs('eventable');         // eventable_type + eventable_id (polimórfico)
    $table->foreignId('actor_id')->nullable()->constrained('users');
    $table->json('payload')->nullable(); // Datos adicionales del evento
    $table->timestamp('occurred_at');
    $table->timestamps();
    
    $table->index(['type', 'occurred_at']);
    $table->index('occurred_at');
});
```

### Task 11.2: Crear endpoint de eventos recientes

```
GET /v1/events/recent?limit=20&type=deployment,release
```

### Task 11.3: Emitir eventos desde Observers existentes

Los 44 Observers ya existentes se pueden extender para crear `ActivityEvent` en `created()`, `updated()`, `deleted()`.

### Task 11.4: Webhook genérico de entrada

Generalizar el patrón de `DeploymentWebhookController` para soportar otros webhooks futuros (GitHub Actions, GitLab CI, etc.):
```
POST /v1/webhooks/{provider}/deployments → Jenkins, GitHub Actions, etc.
```

---

## 14. Priorización y Roadmap (Actualizado con TODOs)

> **Cambios respecto al roadmap original:** Los TODOs del PR #39 incrementan el esfuerzo total en ~18-22h y reorganizan prioridades.

### Fase 1 — Estabilización + Webhooks (Semana 1)
> Corregir rutas rotas, establecer patrón webhook, separar controllers.

| Task | Épica | Descripción | Esfuerzo |
|---|---|---|---|
| 1.1 | Rutas Rotas | Corregir `entities/{entity}/components` | 30 min |
| 1.2 | Rutas Rotas | Corregir `apis/access-policies/{id}/apis` | 30 min |
| 1.3.1-1.3.5 | **Rutas + Webhooks** | Crear `webhooks.php`, middleware `VerifyWebhookToken`, rate limiter | **2h** ⬆️ |
| 1.4 | Rutas Rotas | Descomentar `frameworks/{framework}/components` | 30 min |
| 1.5 | Rutas Rotas | Corregir UserController con FormRequests | 1h |
| 2.1.1-2.1.4 | **Consistencia** | Separar webhook controller, JSON Schema, refactor CRUD | **3h** ⬆️ |
| 2.2 | Consistencia | AllowedRelationships en SystemController | 30 min |
| 2.3 | Consistencia | Relación `deployments()` en Release | 15 min |
| 2.4 | Consistencia | Auditar patrones de respuesta | 1h |

**Total Fase 1:** ~10h (antes: 6h) — **+4h por webhook/JSON Schema**

---

### Fase 2 — Seguridad + RBAC (Semana 2)
> Auth API, roles reales, rate limiting.

| Task | Épica | Descripción | Esfuerzo |
|---|---|---|---|
| 3.1 | Auth | Instalar y configurar Sanctum | 2h |
| 3.2 | Auth | Middleware auth en rutas API | 1h |
| 3.3 | Auth | Endpoints login/register/logout/me | 3h |
| 3.4.1-3.4.6 | **RBAC** | Migración `roles`, modelo `Role`, relación en User, seeder | **2h** ⬆️ |
| 3.4.7 | **Policies** | Implementar lógica real en 39 Policies | **2h** ⬆️ |
| 3.4.8 | **Tests RBAC** | Tests unitarios Role + User helpers | **30 min** 🆕 |
| 3.5 | Auth | Actualizar `authorize()` en 76 Form Requests | 1h |
| 7.1 | Rate Limiting | Configurar rate limiter (api + webhooks) | 1h |
| 7.2 | Middleware | ForceJsonResponse | 1h |
| 7.3 | CORS | Mejorar config CORS | 30 min |

**Total Fase 2:** ~14h (antes: 8.5h) — **+5.5h por RBAC detallado**

---

### Fase 3 — Testing (Semanas 3-4)
> Feature tests + unit tests. Incluye tests de webhook y RBAC.

| Task | Épica | Descripción | Esfuerzo |
|---|---|---|---|
| 4.1 | Feature Tests | Crear ApiTestCase base | 1h |
| 4.2 | Feature Tests | Tests ComponentController CRUD | 2h |
| 4.3-4.15 | Feature Tests | Tests todos los dominios | 15h |
| 4.15 | **Feature Tests** | **Tests DeploymentWebhookController** (nuevo) | **2h** 🆕 |
| 4.16 | Feature Tests | Tests lookup/catalog controllers | 5h |
| 10.1-10.2 | Unit Tests | Traits + enums faltantes | 3h |

**Total Fase 3:** ~28h (antes: 26h) — **+2h por tests webhook**

---

### Fase 4 — Funcionalidades (Semana 5)
> Búsqueda, filtrado, y datos de prueba con nueva estructura de seeders.

| Task | Épica | Descripción | Esfuerzo |
|---|---|---|---|
| 5.1-5.3 | Search/Filter/Sort | Crear traits Filterable, Sortable, Searchable | 4h |
| 5.4-5.5 | Integración | Integrar traits en modelos y controllers | 4h |
| 6.1 | **Seeders App** | Crear `RoleSeeder`, `LinkCategorySeeder`, `ResourceCategorySeeder` | **1h** |
| 6.1 | **Seeders Ejemplo** | Crear directorio `examples/` + 9 seeders con Factories | **4h** ⬆️ |
| 6.2 | Seeders | Actualizar DatabaseSeeder con nueva estructura | **1h** ⬆️ |

**Total Fase 4:** ~14h (antes: 12h) — **+2h por estructura seeders**

---

### Fase 5 — Documentación y Caché (Semanas 6-7)
> API spec (Scramble), Service Layer, Caché.

| Task | Épica | Descripción | Esfuerzo |
|---|---|---|---|
| 9.1.1-9.1.6 | **API Spec** | Eliminar spec manual, configurar Scramble, evaluar Pro | **2h** |
| 9.2 | API Spec | Mejorar anotaciones PHPDoc para Scramble | 2h |
| 9.3 | API Spec | Verificar cobertura de todos los endpoints | 1h |
| 8.1 | Service Layer | DeploymentService (extraer lógica de controller) | 4h |
| 8.2.1-8.2.7 | **Caché** | Valkey, trait CachesResponses, invalidación, UI | **8h** 🆕 |

**Total Fase 5:** ~17h (antes: 8-12h) — **+8h por capa de caché**

---

### Fase 6 — Eventos y Extensibilidad (Semana 8) — NUEVA
> Sistema de eventos recientes y webhook genérico.

| Task | Épica | Descripción | Esfuerzo |
|---|---|---|---|
| 11.1 | Eventos | Modelo `ActivityEvent` polimórfico + migración | 3h |
| 11.2 | Eventos | Endpoint `GET /v1/events/recent` | 2h |
| 11.3 | Eventos | Emitir eventos desde Observers | 4h |
| 11.4 | Webhooks | Generalizar patrón webhook multi-provider | 4h |

**Total Fase 6:** ~13h — **100% Nueva**

---

### Resumen del Roadmap Actualizado

| Fase | Semana | Foco | Horas | Delta vs Original |
|---|---|---|---|---|
| 1 — Estabilización | 1 | Rutas + webhooks + consistencia | **~10h** | +4h |
| 2 — Seguridad | 2 | Auth + RBAC + rate limiting | **~14h** | +5.5h |
| 3 — Testing | 3-4 | Feature tests + unit tests | **~28h** | +2h |
| 4 — Funcionalidades | 5 | Search/filter + seeders restructurados | **~14h** | +2h |
| 5 — Documentación | 6-7 | Scramble + service layer + **caché** | **~17h** | +5-9h |
| 6 — Eventos | 8 | **Activity events + webhooks genéricos** | **~13h** | 🆕 |
| **TOTAL** | | | **~96h** | **+32-36h** |

**El impacto total de los 6 TODOs incrementa el plan de ~64h a ~96h (+50%).**

### Mapa de impacto TODO → Tasks

| TODO | Sección Original | Tasks Nuevas/Modificadas | Delta Esfuerzo |
|---|---|---|---|
| 🔵 DeploymentController = webhook Jenkins | Task 1.3 | 1.3.1-1.3.5, 2.1.1-2.1.4, 11.4, 4.15 | +8h |
| 🔵 Validación JSON Schema para store() | Task 2.1 | 2.1.2, 2.1.4 (paquete `opis/json-schema`) | +2h |
| 🔵 Tabla `roles` + relación | Task 3.4 | 3.4.1-3.4.8 (8 subtasks detalladas) | +2h |
| 🔵 Seeders app vs ejemplo | Task 6.1 | Reestructura completa, directorio `examples/` | +2h |
| 🔵 Caché Valkey + UI | Épica 8 | Task 8.2.1-8.2.7 (nueva sección completa) | +8h |
| 🔵 Scramble Pro, eliminar spec manual | Task 9.1 | 9.1.1-9.1.6 (subtasks detalladas) | +1h |
| 🆕 Sistema de eventos recientes | N/A | **Épica 11 completa** (Tasks 11.1-11.4) | +13h |

---

## Apéndice A: Diagrama de Dependencias entre Épicas (Actualizado)

```
Épica 1 (Rutas + Webhooks) ─────────┐
         │                           ├──→ Épica 4 (Feature Tests)
         │  Épica 2 (Consistencia) ──┘
         │         │                        │
         │         └── JSON Schema ──→ opis/json-schema (composer)
         │                                  │
Épica 3 (Auth + RBAC) ──→ Épica 7 (Rate Limit + Webhook throttle)
         │                                  │
         ├── 3.4 Tabla roles ──→ 3.4.7 Policies reales
         │                                  │
         └──→ Épica 4 (Feature Tests auth)  │
                                            │
Épica 5 (Search/Filter) ──── independiente  │
                                            │
Épica 6 (Seeders app + ejemplo) ←── 3.4.5 RoleSeeder
                                            │
Épica 9 (Scramble) ←── Épica 1 (webhooks necesitan doc)
         │                                  │
         └── Scramble Pro? ←── webhooks docs│
                                            │
Épica 8 (Services + Caché) ←── Observers    │
         │                                  │
         └── 8.2 Valkey ──→ docker-compose  │
                                            │
Épica 10 (Unit Tests) ──── independiente    │
                                            │
Épica 11 (Eventos) ←── Épica 1, 2, 3 ──────┘
```

---

## Apéndice B: Archivos Clave por Referencia (Actualizado)

| Archivo | Propósito |
|---|---|
| `src/bootstrap/app.php` | Middleware global, routing, exceptions |
| `src/routes/api.php` | Include de todos los archivos de rutas por dominio |
| `src/routes/v1/*.php` | Definiciones de rutas por dominio |
| `src/routes/v1/webhooks.php` | 🆕 Endpoints de ingesta (Jenkins, etc.) |
| `src/config/auth.php` | Configuración de autenticación |
| `src/config/cors.php` | Configuración CORS |
| `src/config/cache.php` | Configuración de caché (Valkey/Redis) |
| `src/config/scramble.php` | Configuración de Scramble (auto-gen OpenAPI) |
| `src/phpunit.xml` | Configuración de PHPUnit (usa SQLite in-memory) |
| `src/app/Providers/AppServiceProvider.php` | Rate limiting, gates, bindings |
| `src/storage/schemas/deployment-webhook.json` | 🆕 JSON Schema para validar webhook payload |
| `src/database/seeders/examples/` | 🆕 Directorio de seeders de datos de ejemplo |
| ~~`docs/api/v1.0.0.yml`~~ | ~~API spec manual~~ → Eliminado, usar Scramble |

---

## Apéndice C: Paquetes Nuevos Requeridos

| Paquete | Propósito | Task | Tipo |
|---------|-----------|------|------|
| `laravel/sanctum` | Autenticación API (tokens) | 3.1 | require |
| `opis/json-schema` | Validación JSON Schema para webhooks | 2.1.4 | require |
| `dedoc/scramble-pro` | Documentación API + webhooks (evaluar) | 9.1.6 | require-dev |
| `valkey/valkey` (Docker) | Cache store | 8.2.2 | docker |

---

*Plan generado el 4 de marzo de 2026 — Actualizado con TODOs del PR #39*
*Branch: `analysis/backend-implementation-plan`*
