# Actualización del Esquema de Datos del Frontend

**Fecha**: 2 de noviembre de 2025  
**Archivo**: `frontend/types/api.ts`  
**Fuente**: Esquema DBML completo de la base de datos

## 📋 Resumen de Cambios

Se ha actualizado completamente el archivo `types/api.ts` para reflejar el esquema completo de la base de datos Atlas Catalog según el archivo DBML proporcionado.

## ✨ Nuevas Entidades Agregadas

### 1. **Usuarios y Grupos** (Users & Groups)

-   `User` - Usuarios del sistema
-   `Group` - Grupos/equipos
-   `GroupType` - Tipos de grupos
-   `GroupMember` - Miembros de grupos
-   `GroupMemberRole` - Roles de miembros

### 2. **Dominios de Negocio** (Business Domain)

-   `BusinessDomain` - Dominios de negocio con jerarquía
-   `BusinessTier` - Niveles de negocio
-   `BusinessCriticalityLevel` - Niveles de criticidad

### 3. **Ambientes y Estados** (Environments & Status)

-   `Environment` - Ambientes de despliegue (dev, prod, etc.)
-   `ServiceStatus` - Estados de servicio
-   `OperationalStatus` - Estados operacionales

### 4. **Componentes** (Components)

-   `Component` - Componentes de software
-   `ComponentCategory` - Categorías de componentes
-   `ComponentEnvironment` - Relación componente-ambiente
-   `ComponentResource` - Recursos asociados a componentes
-   `ComponentApi` - APIs asociadas a componentes

### 5. **Frameworks y Lenguajes** (Programming)

-   `Framework` - Frameworks de desarrollo
-   `ProgrammingLanguage` - Lenguajes de programación (actualizado)

### 6. **Construcción y Despliegue** (Build & Deploy)

-   `Build` - Construcciones/builds
-   `Release` - Releases de componentes
-   `Deployment` - Despliegues

### 7. **Recursos** (Resources)

-   `Resource` - Recursos del sistema
-   `ResourceType` - Tipos de recursos

### 8. **APIs** (APIs)

-   `Api` - APIs del catálogo (actualizado)
-   `ApiType` - Tipos de API
-   `ApiStatus` - Estados de API
-   `ApiCategory` - Categorías de API

### 9. **Infraestructura** (Infrastructure)

-   `Cluster` - Clusters de infraestructura
-   `ClusterType` - Tipos de cluster
-   `ClusterNode` - Nodos de cluster
-   `ClusterServiceAccount` - Cuentas de servicio de cluster
-   `Node` - Nodos de infraestructura
-   `Vendor` - Proveedores/vendedores
-   `ServiceAccount` - Cuentas de servicio
-   `ServiceAccountToken` - Tokens de cuentas de servicio

### 10. **Enlaces y Relaciones** (Links & Relationships)

-   `Link` - Enlaces entre entidades
-   `LinkType` - Tipos de enlaces
-   `KeyRelationship` - Relaciones clave

## 🔢 Enumeraciones Agregadas

```typescript
enum AuthorizationMethod {
    BASIC,
    OAUTH,
    KEY,
    NONE,
}

enum Protocol {
    HTTP,
    HTTPS,
}

enum AccessPolicy {
    PUBLIC,
    INTERNAL,
    THIRD_PARTY,
}

enum DomainCategory {
    CORE,
    SUPPORTING,
    GENERIC,
}

enum DiscoverySource {
    SCAN,
    PIPELINE,
    MANUAL,
}

enum BuildResult {
    SUCCESS,
    FAILURE,
    ABORTED,
    UNSTABLE,
}

enum WorkloadKind {
    DEPLOYMENT,
    DAEMONSET,
    STATEFULSET,
    REPLICASET,
}

enum NodeType {
    PHYSICAL,
    VIRTUAL,
    CLOUD,
}

enum CpuArchitecture {
    X86,
    X86_64,
    ARM,
    ARM64,
}
```

## 📊 Estructura de Tipos

Cada entidad ahora incluye:

1. **Schema Zod** - Para validación en tiempo de ejecución
2. **Type TypeScript** - Para type checking en desarrollo
3. **Response Schemas** - Para respuestas individuales
4. **Paginated Response Schemas** - Para respuestas paginadas
5. **Create Request** - Para creación de recursos
6. **Update Request** - Para actualización de recursos

## 🔗 Relaciones Modeladas

-   **Jerarquías**:
    -   Grupos con parent_id
    -   Dominios de negocio con parent_id
-   **Referencias Cruzadas**:
    -   Componentes → Plataformas, Lifecycles, Dominios, Tiers
    -   Releases → Components, Builds, Frameworks, Languages
    -   Deployments → Releases, Environments
    -   APIs → Categories, Types, Status
    -   Clusters → Types, Vendors
    -   Nodes → Clusters, Lifecycles, Operational Status

## 📝 Campos Comunes

Todas las entidades incluyen:

```typescript
// Timestamps
created_at: string;
updated_at: string;

// User References
created_by: number | null;
updated_by: number | null;
```

## 🎯 Campos Especiales

### Componentes

-   `discovery_source`: SCAN | PIPELINE | MANUAL
-   `has_zero_downtime_deployment`: boolean
-   `is_stateless`: boolean
-   `tags`: JSON object

### APIs

-   `access_policy`: PUBLIC | INTERNAL | THIRD_PARTY
-   `auth_method`: BASIC | OAUTH | KEY | NONE
-   `protocol`: HTTP | HTTPS
-   `document_specification`: JSON object
-   `compliance`, `compliance_status`
-   `deprecated_at`, `deprecated_by`, `deprecation_reason`

### Nodes

-   `cpu_architecture`, `cpu_count`, `cpu_sockets`
-   `memory_bytes`
-   `ip_address`, `mac_address`, `fqdn`
-   `is_virtual`, `node_type`
-   `os`, `os_version`

### Releases

-   Múltiples digests: `md5`, `sha1`, `sha256`
-   SBOM: `sbom_ref`, `sbom_digest`

## 🚀 Uso de los Nuevos Tipos

### Ejemplo: Crear un Componente

```typescript
import { CreateComponentRequest, DiscoverySource } from "@/types/api";

const newComponent: CreateComponentRequest = {
    name: "user-service",
    slug: "user-service",
    display_name: "User Service",
    description: "Microservicio de gestión de usuarios",
    type_id: 1,
    platform_id: 2,
    lifecycle_id: 3,
    domain_id: 4,
    discovery_source: DiscoverySource.PIPELINE,
    is_stateless: true,
    has_zero_downtime_deployment: true,
    tags: {
        team: "platform",
        language: "typescript",
    },
};
```

### Ejemplo: Crear un API

```typescript
import {
    CreateApiRequest,
    AccessPolicy,
    AuthorizationMethod,
    Protocol,
} from "@/types/api";

const newApi: CreateApiRequest = {
    name: "users-api",
    display_name: "Users API",
    description: "API REST para gestión de usuarios",
    access_policy: AccessPolicy.INTERNAL,
    auth_method: AuthorizationMethod.OAUTH,
    protocol: Protocol.HTTPS,
    type_id: 1,
    category_id: 2,
    version: "v1.0.0",
    document_specification: {
        openapi: "3.0.0",
        // ... spec completa
    },
};
```

### Ejemplo: Validación con Zod

```typescript
import { apiSchema } from "@/types/api";

// Validar datos de API
const result = apiSchema.safeParse(apiData);

if (result.success) {
    const validApi = result.data;
    // usar datos validados
} else {
    console.error("Errores de validación:", result.error);
}
```

## 📦 Respuestas Paginadas

Todas las entidades tienen tipos para respuestas paginadas:

```typescript
import { PaginatedComponentResponse } from "@/types/api";

async function getComponents(
    page: number
): Promise<PaginatedComponentResponse> {
    const response = await fetch(`/api/v1/components?page=${page}`);
    return response.json();
}
```

## 🔄 Próximos Pasos

1. **Actualizar módulos API** en `lib/api/`:

    - Crear módulos para las nuevas entidades
    - Implementar funciones CRUD para cada tipo

2. **Crear componentes de UI**:

    - Formularios para crear/editar entidades
    - Tablas para listar entidades
    - Visualizaciones para relaciones

3. **Implementar páginas**:

    - Páginas de catálogo para cada entidad
    - Páginas de detalle con relaciones
    - Dashboards de métricas

4. **Testing**:
    - Tests unitarios para validación Zod
    - Tests de integración para API calls
    - Tests E2E para flujos completos

## 📚 Recursos

-   **Archivo DBML original**: `/Users/keskes/Downloads/Atlas_2025-11-02T15_38_44.255Z.dbml`
-   **Archivo anterior**: `frontend/types/api-old.ts` (backup)
-   **Archivo actual**: `frontend/types/api.ts`

## ⚠️ Notas Importantes

1. **Backend Read-Only**: Recuerda que el backend Laravel NO debe modificarse. Cualquier discrepancia entre estos tipos y la API real debe manejarse en el frontend.

2. **Validación**: Todos los tipos usan Zod para validación en tiempo de ejecución. Úsalos para validar respuestas de API.

3. **Nullables**: Muchos campos son opcionales/nullable según el esquema. Maneja estos casos en la UI.

4. **Enums**: Los enums deben coincidir exactamente con los valores del backend. Si hay diferencias, ajusta los tipos del frontend.

## 🎨 Convenciones de Nombres

-   **Schemas**: `entitySchema` (camelCase con Schema suffix)
-   **Types**: `Entity` (PascalCase)
-   **Response Types**: `EntityResponse`, `PaginatedEntityResponse`
-   **Request Types**: `CreateEntityRequest`, `UpdateEntityRequest`

---

**Autor**: GitHub Copilot  
**Fecha**: 2 de noviembre de 2025  
**Versión**: 1.0.0
