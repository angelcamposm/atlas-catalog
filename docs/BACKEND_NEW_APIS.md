# Backend API - Nuevos Endpoints Disponibles

## Resumen

El backend ha sido actualizado desde master e incluye **múltiples nuevas APIs** que actualmente **NO están siendo expuestas en las rutas** (`api.php`) ni consumidas por el frontend.

## 📋 Estado Actual de las APIs

### ✅ APIs Expuestas y Documentadas

Estas APIs están en `routes/api.php` y pueden ser consumidas:

#### API Domain

-   `GET|POST /api/v1/apis` - Gestión de APIs
-   `GET|POST /api/v1/api-categories` - Categorías de APIs (NUEVO desde master)
-   `GET|POST /api/v1/api-types` - Tipos de API (REST, GraphQL, etc.)
-   `GET|POST /api/v1/api-statuses` - Estados de APIs
-   `GET|POST /api/v1/api-access-policies` - Políticas de acceso

#### Business Domain

-   `GET|POST /api/v1/business-domains` - Dominios de negocio
-   `GET|POST /api/v1/business-tiers` - Niveles de negocio
-   `GET|POST /api/v1/environments` - Entornos (Dev, Prod, etc.)
-   `GET|POST /api/v1/lifecycles` - Ciclos de vida

#### Technology Domain

-   `GET|POST /api/v1/frameworks` - Frameworks
-   `GET|POST /api/v1/programming-languages` - Lenguajes de programación
-   `GET|POST /api/v1/vendors` - Proveedores/Vendors

#### Resource Domain

-   `GET|POST /api/v1/resources` - Recursos
-   `GET|POST /api/v1/resource-types` - Tipos de recursos

#### Security Domain

-   `GET|POST /api/v1/authentication-methods` - Métodos de autenticación
-   `GET|POST /api/v1/service-accounts` - Service Accounts

#### Account Domain

-   `GET|POST /api/v1/groups` - Grupos
-   `GET|POST /api/v1/group-types` - Tipos de grupos
-   `GET|POST /api/v1/group-member-roles` - Roles de miembros

### ❌ APIs Disponibles pero NO Expuestas

Estos controladores existen pero **NO están en las rutas**:

#### Infrastructure Domain (Kubernetes/Clusters)

-   **ClusterController** - Gestión de clusters Kubernetes

    -   Modelo: `Cluster`
    -   Requests: `StoreClusterRequest`, `UpdateClusterRequest`
    -   Resources: `ClusterResource`, `ClusterResourceCollection`

-   **ClusterTypeController** - Tipos de clusters

    -   Modelo: `ClusterType`
    -   Enums relacionados: `K8sLicensingModel`, `CpuArchitecture`

-   **ClusterServiceAccountController** - Service Accounts de clusters

    -   Modelo: `ClusterServiceAccount`

-   **NodeController** - Nodos de infraestructura
    -   Modelo: `Node`
    -   Enums relacionados: `NodeType`, `NodeRole`

#### Platform Domain

-   **PlatformController** - Plataformas

    -   Modelo: `Platform`

-   **ComponentTypeController** - Tipos de componentes
    -   Modelo: `ComponentType`

#### Integration Domain

-   **LinkController** - Enlaces/Integraciones

    -   Modelo: `Link`
    -   Enum: `CommunicationStyle`, `Protocol`

-   **LinkTypeController** - Tipos de enlaces
    -   Modelo: `LinkType`

#### Security Domain (Extended)

-   **ServiceAccountTokenController** - Tokens de service accounts
    -   Modelo: `ServiceAccountToken`

## 📊 Nuevos Modelos y Enums

### Modelos Agregados desde Master

1. **Cluster** - Gestión de clusters Kubernetes
2. **ClusterNode** - Relación cluster-nodo (pivot)
3. **ClusterServiceAccount** - Service accounts por cluster
4. **ClusterType** - Tipos de cluster
5. **ComponentType** - Tipos de componentes
6. **Node** - Nodos de infraestructura
7. **Platform** - Plataformas
8. **Link** - Enlaces entre servicios
9. **LinkType** - Tipos de enlaces
10. **ServiceAccountToken** - Tokens de autenticación
11. **GroupMember** - Miembros de grupos (pivot)
12. **ApiCategory** - Categorías de APIs

### Enums Agregados

1. **CommunicationStyle** - Estilos de comunicación (Sync, Async, etc.)
2. **CpuArchitecture** - Arquitecturas de CPU (x86_64, ARM64, etc.)
3. **K8sLicensingModel** - Modelos de licenciamiento Kubernetes
4. **NodeRole** - Roles de nodos (Master, Worker, etc.)
5. **NodeType** - Tipos de nodos
6. **Protocol** - Protocolos (HTTP, HTTPS, gRPC, etc.)

### Helpers Agregados

-   **MemoryBytes** - Conversión de unidades de memoria

## 🔧 Rutas Sugeridas a Agregar

```php
Route::prefix('v1')->group(function () {
    // ... rutas existentes ...

    // Infrastructure Domain
    Route::apiResource('clusters', ClusterController::class);
    Route::apiResource('cluster-types', ClusterTypeController::class);
    Route::apiResource('cluster-service-accounts', ClusterServiceAccountController::class);
    Route::apiResource('nodes', NodeController::class);

    // Platform Domain
    Route::apiResource('platforms', PlatformController::class);
    Route::apiResource('component-types', ComponentTypeController::class);

    // Integration Domain
    Route::apiResource('links', LinkController::class);
    Route::apiResource('link-types', LinkTypeController::class);

    // Extended Security
    Route::apiResource('service-account-tokens', ServiceAccountTokenController::class);
});
```

## 📁 Estructura de Archivos Backend

```
src/app/
├── Http/
│   ├── Controllers/          # 28 controladores
│   ├── Requests/             # Store/Update requests para cada modelo
│   └── Resources/            # API Resources para respuestas JSON
├── Models/                   # 30 modelos
├── Observers/                # Observers para cada modelo
├── Policies/                 # Policies para autorización
├── Enums/                    # 6 enums nuevos
└── Helpers/                  # Helper classes
```

## 🎯 Próximos Pasos Recomendados

### 1. Backend - Actualizar Rutas

-   [ ] Agregar rutas para los controladores faltantes
-   [ ] Documentar cada endpoint con PHPDoc/OpenAPI
-   [ ] Agregar middleware de autenticación si es necesario

### 2. Frontend - Tipos TypeScript

-   [ ] Crear interfaces TypeScript para los nuevos modelos:
    -   `Cluster`, `Node`, `Link`, `Platform`, etc.
-   [ ] Actualizar `types/api.ts` con las nuevas interfaces
-   [ ] Crear enums TypeScript que coincidan con los del backend

### 3. Frontend - API Client

-   [ ] Crear módulos en `lib/api/` para cada dominio:
    -   `infrastructure.ts` - Clusters, Nodes
    -   `platform.ts` - Platforms, Components
    -   `integration.ts` - Links
-   [ ] Implementar funciones CRUD para cada recurso

### 4. Frontend - UI Components

-   [ ] Crear páginas para gestionar clusters
-   [ ] Crear páginas para gestionar nodos
-   [ ] Crear páginas para gestionar enlaces/integraciones
-   [ ] Crear páginas para gestionar plataformas

### 5. Documentación

-   [ ] Documentar la arquitectura completa
-   [ ] Crear guía de uso de las nuevas APIs
-   [ ] Documentar relaciones entre modelos

## 📖 Documentación de Referencia

### Architecture Decision Records (ADR)

El proyecto incluye documentación en `docs/adr/`:

1. `001-laravel-framework-for-backend-development.md`
2. `002-nginx-and-php-fpm-for-web-server.md`
3. `003-postgresql-for-database.md`

### Migraciones

Nuevas migraciones en `src/database/migrations/`:

-   `2025_10_19_101241_create_api_categories_table.php`
-   `2025_10_25_182513_create_environments_table.php`
-   `2025_10_25_195228_create_group_types_table.php`
-   `2025_10_25_200123_create_groups_table.php`
-   `2025_10_26_172711_create_nodes_table.php`
-   `2025_10_26_185535_create_cluster_types_table.php`
-   `2025_10_26_195617_create_clusters_table.php`
-   `2025_10_27_221646_create_platforms_table.php`
-   `2025_10_28_175708_create_link_types_table.php`
-   `2025_10_28_180710_create_links_table.php`
-   Y más...

## 🔄 Relaciones entre Modelos

### Cluster Domain

```
Cluster
├── belongsTo: ClusterType
├── belongsToMany: Node (through cluster_node)
└── hasMany: ClusterServiceAccount

Node
├── belongsTo: Environment
└── belongsToMany: Cluster (through cluster_node)
```

### Integration Domain

```
Link
├── belongsTo: LinkType
├── morphTo: source (polymorphic)
└── morphTo: target (polymorphic)
```

### Account Domain

```
Group
├── belongsTo: GroupType
└── belongsToMany: User (through GroupMember)
    └── pivot has: GroupMemberRole
```

## 💡 Recomendaciones

1. **Priorizar por dominio**: Implementar primero los dominios más importantes
2. **Seguir patrones existentes**: El código está bien estructurado, seguir los mismos patrones
3. **Testing**: Crear tests para los nuevos endpoints
4. **Documentación**: Usar OpenAPI/Swagger para documentar las APIs
5. **Versionado**: Las rutas ya usan `/v1`, mantener ese estándar

## ⚠️ Notas Importantes

-   Todos los modelos usan el trait `BelongsToUser` para tracking de creación/actualización
-   Los Observers están implementados para cada modelo
-   Las Policies están listas para autorización
-   Los seeders están actualizados con datos de prueba
-   El proyecto usa `HasDataFile` trait para separar datos de seeders
