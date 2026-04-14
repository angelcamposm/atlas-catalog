# 📋 Plan de Adaptación Frontend a Cambios del Backend

## 📅 Fecha: 25 de Diciembre 2025

Este documento describe los cambios necesarios para sincronizar el frontend con la nueva estructura del backend.

---

## 🔴 CAMBIO CRÍTICO: Nueva Estructura de Rutas API

El backend ha **reorganizado completamente las rutas API** de una estructura plana a una estructura **por dominios**:

### Estructura Anterior (Frontend actual)

```
/api/v1/clusters
/api/v1/cluster-types
/api/v1/nodes
/api/v1/links
/api/v1/platforms
/api/v1/business-domains
/api/v1/vendors
/api/v1/frameworks
...
```

### Nueva Estructura (Backend master)

```
/api/v1/infrastructure/clusters
/api/v1/infrastructure/clusters/types
/api/v1/infrastructure/nodes
/api/v1/infrastructure/vendors

/api/v1/catalog/apis
/api/v1/catalog/apis/types
/api/v1/catalog/apis/categories
/api/v1/catalog/components
/api/v1/catalog/components/types
/api/v1/catalog/environments
/api/v1/catalog/frameworks
/api/v1/catalog/links
/api/v1/catalog/links/categories
/api/v1/catalog/platforms
/api/v1/catalog/programming-languages
/api/v1/catalog/resources
/api/v1/catalog/resources/categories
/api/v1/catalog/service-models (¡NUEVO!)

/api/v1/architecture/business-domains
/api/v1/architecture/business-capabilities (¡NUEVO!)
/api/v1/architecture/business-tiers
/api/v1/architecture/entities (¡NUEVO!)
/api/v1/architecture/lifecycles
/api/v1/architecture/systems (¡NUEVO!)

/api/v1/organization/groups
/api/v1/organization/groups/types
/api/v1/organization/groups/member-roles
/api/v1/organization/users (¡NUEVO!)

/api/v1/security/authentication-methods
/api/v1/security/service-accounts
/api/v1/security/service-accounts/tokens

/api/v1/compliance/compliance-standards

/api/v1/operations/service-statuses

/api/v1/ci-cd/workflows/runs (¡NUEVO!)
/api/v1/ci-cd/workflows/commits (¡NUEVO!)
/api/v1/ci-cd/workflows/{id}/jobs (¡NUEVO!)
```

---

## 📊 Resumen de Impacto

| Área                         | Archivos Afectados | Prioridad | Esfuerzo |
| ---------------------------- | ------------------ | --------- | -------- |
| Rutas API - Infrastructure   | 1 archivo          | 🔴 Alta   | Medio    |
| Rutas API - Catalog          | 5+ archivos        | 🔴 Alta   | Alto     |
| Rutas API - Architecture     | 1 archivo          | 🔴 Alta   | Medio    |
| Rutas API - Organization     | 1 archivo          | 🔴 Alta   | Bajo     |
| Rutas API - Security         | 1 archivo          | 🔴 Alta   | Bajo     |
| Nuevos Modelos TypeScript    | types/api.ts       | 🟡 Media  | Alto     |
| Nuevas APIs (Service Models) | Crear archivo      | 🟡 Media  | Medio    |
| Nuevas APIs (Entities)       | Crear archivo      | 🟡 Media  | Medio    |
| Nuevas APIs (Systems)        | Crear archivo      | 🟡 Media  | Medio    |
| Nuevas APIs (Users)          | Crear archivo      | 🟡 Media  | Bajo     |
| Nuevas APIs (CI/CD)          | Crear archivo      | 🟢 Baja   | Medio    |

---

## 📁 FASE 1: Actualizar Rutas API Existentes (CRÍTICO)

### 1.1 Infrastructure Domain (`frontend/lib/api/infrastructure.ts`)

**Cambios requeridos:**

| Ruta Actual          | Nueva Ruta                          |
| -------------------- | ----------------------------------- |
| `/v1/clusters`       | `/v1/infrastructure/clusters`       |
| `/v1/clusters/types` | `/v1/infrastructure/clusters/types` |
| `/v1/nodes`          | `/v1/infrastructure/nodes`          |

**Nuevos endpoints a agregar:**

-   `GET /v1/infrastructure/clusters/{id}/nodes` - Nodos de un cluster
-   `GET /v1/infrastructure/clusters/{id}/service-accounts` - Service accounts de cluster
-   `GET /v1/infrastructure/types` - Tipos de infraestructura

### 1.2 Catalog Domain - APIs (`frontend/lib/api/apis.ts`)

**Cambios requeridos:**

| Ruta Actual | Nueva Ruta         |
| ----------- | ------------------ |
| `/v1/apis`  | `/v1/catalog/apis` |

**Nuevos endpoints:**

-   `GET /v1/catalog/apis/{api}/components` - Componentes de una API

### 1.3 Catalog Domain - API Extended (`frontend/lib/api/api-extended.ts`)

**Cambios requeridos:**

| Ruta Actual                | Nueva Ruta                         |
| -------------------------- | ---------------------------------- |
| `/v1/apis/types`           | `/v1/catalog/apis/types`           |
| `/v1/apis/categories`      | `/v1/catalog/apis/categories`      |
| `/v1/apis/access-policies` | `/v1/catalog/apis/access-policies` |

### 1.4 Catalog Domain - API Types (`frontend/lib/api/api-types.ts`)

**Cambios requeridos:**

| Ruta Actual     | Nueva Ruta               |
| --------------- | ------------------------ |
| `/v1/api-types` | `/v1/catalog/apis/types` |

### 1.5 Platform Domain (`frontend/lib/api/platform.ts`)

**Cambios requeridos:**

| Ruta Actual           | Nueva Ruta                     |
| --------------------- | ------------------------------ |
| `/v1/platforms`       | `/v1/catalog/platforms`        |
| `/v1/component-types` | `/v1/catalog/components/types` |

**Nuevos endpoints:**

-   `GET /v1/catalog/platforms/{platform}/components`

### 1.6 Integration Domain (`frontend/lib/api/integration.ts`)

**Cambios requeridos:**

| Ruta Actual            | Nueva Ruta                     |
| ---------------------- | ------------------------------ |
| `/v1/links`            | `/v1/catalog/links`            |
| `/v1/links/categories` | `/v1/catalog/links/categories` |

### 1.7 Business Domain (`frontend/lib/api/business.ts`)

**Cambios requeridos:**

| Ruta Actual            | Nueva Ruta                          |
| ---------------------- | ----------------------------------- |
| `/v1/business-domains` | `/v1/architecture/business-domains` |
| `/v1/business-tiers`   | `/v1/architecture/business-tiers`   |
| `/v1/environments`     | `/v1/catalog/environments`          |

**Nuevos endpoints:**

-   `GET /v1/architecture/business-domains/{id}/components`
-   `GET /v1/architecture/business-domains/{id}/entities`

### 1.8 Technology Domain (`frontend/lib/api/technology.ts`)

**Cambios requeridos:**

| Ruta Actual                  | Nueva Ruta                            |
| ---------------------------- | ------------------------------------- |
| `/v1/vendors`                | `/v1/infrastructure/vendors`          |
| `/v1/frameworks`             | `/v1/catalog/frameworks`              |
| `/v1/authentication-methods` | `/v1/security/authentication-methods` |

### 1.9 Programming Languages (`frontend/lib/api/programming-languages.ts`)

**Cambios requeridos:**

| Ruta Actual                 | Nueva Ruta                          |
| --------------------------- | ----------------------------------- |
| `/v1/programming-languages` | `/v1/catalog/programming-languages` |

### 1.10 Lifecycles (`frontend/lib/api/lifecycles.ts`)

**Cambios requeridos:**

| Ruta Actual      | Nueva Ruta                    |
| ---------------- | ----------------------------- |
| `/v1/lifecycles` | `/v1/architecture/lifecycles` |

**Nuevos endpoints:**

-   `GET /v1/architecture/lifecycles/{id}/components`

### 1.11 Groups Domain (`frontend/lib/api/groups.ts`)

**Cambios requeridos:**

| Ruta Actual               | Nueva Ruta                             |
| ------------------------- | -------------------------------------- |
| `/v1/groups`              | `/v1/organization/groups`              |
| `/v1/groups/types`        | `/v1/organization/groups/types`        |
| `/v1/groups/member-roles` | `/v1/organization/groups/member-roles` |

### 1.12 Resources Domain (`frontend/lib/api/resources.ts`)

**Cambios requeridos:**

| Ruta Actual                | Nueva Ruta                         |
| -------------------------- | ---------------------------------- |
| `/v1/resources`            | `/v1/catalog/resources`            |
| `/v1/resources/categories` | `/v1/catalog/resources/categories` |

### 1.13 Security Domain (`frontend/lib/api/security.ts`)

**Cambios requeridos:**

| Ruta Actual                   | Nueva Ruta                             |
| ----------------------------- | -------------------------------------- |
| `/v1/service-accounts/tokens` | `/v1/security/service-accounts/tokens` |

### 1.14 Service Accounts (`frontend/lib/api/service-accounts.ts`)

**Cambios requeridos:**

| Ruta Actual            | Nueva Ruta                      |
| ---------------------- | ------------------------------- |
| `/v1/service-accounts` | `/v1/security/service-accounts` |

### 1.15 Compliance Domain (`frontend/lib/api/compliance.ts`)

**Cambios requeridos:**

| Ruta Actual                | Nueva Ruta                            |
| -------------------------- | ------------------------------------- |
| `/v1/compliance-standards` | `/v1/compliance/compliance-standards` |
| `/v1/service-statuses`     | `/v1/operations/service-statuses`     |

### 1.16 Components Domain (`frontend/lib/api/components.ts`)

**Cambios requeridos:**

| Ruta Actual      | Nueva Ruta               |
| ---------------- | ------------------------ |
| `/v1/components` | `/v1/catalog/components` |

---

## 📁 FASE 2: Nuevos Tipos TypeScript (`frontend/types/api.ts`)

### 2.1 Nuevos Modelos a Agregar

```typescript
// Service Models (nuevo en backend)
export const serviceModelSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ServiceModel = z.infer<typeof serviceModelSchema>;

// Entities (nuevo en backend)
export const entitySchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        is_enabled: z.boolean().default(true), // Renombrado desde is_active
        domain_id: nullableNumber(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Entity = z.infer<typeof entitySchema>;

// Entity Attributes
export const entityAttributeSchema = z
    .object({
        id: z.number().int(),
        entity_id: z.number().int(),
        name: z.string().trim().min(1),
        type: nullableString(),
        is_required: z.boolean().default(false),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type EntityAttribute = z.infer<typeof entityAttributeSchema>;

// Systems
export const systemSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type System = z.infer<typeof systemSchema>;

// Business Capabilities
export const businessCapabilitySchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        parent_id: nullableNumber(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type BusinessCapability = z.infer<typeof businessCapabilitySchema>;

// Workflow Runs (CI/CD)
export const workflowRunSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        status: nullableString(),
        started_at: nullableDate(),
        finished_at: nullableDate(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type WorkflowRun = z.infer<typeof workflowRunSchema>;

// Workflow Jobs
export const workflowJobSchema = z
    .object({
        id: z.number().int(),
        workflow_run_id: z.number().int(),
        name: z.string().trim().min(1),
        status: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type WorkflowJob = z.infer<typeof workflowJobSchema>;
```

### 2.2 Actualización de Modelos Existentes

```typescript
// Entity: Renombrar is_active → is_enabled
export const entitySchema = z.object({
    // ...
    is_enabled: z.boolean().default(true), // Antes: is_active
});
```

---

## 📁 FASE 3: Nuevos Módulos API

### 3.1 Crear `frontend/lib/api/service-models.ts`

```typescript
export const serviceModelsApi = {
    getAll: async (page = 1) => {
        /* /v1/catalog/service-models */
    },
    getById: async (id: number) => {
        /* /v1/catalog/service-models/{id} */
    },
    create: async (data) => {
        /* POST /v1/catalog/service-models */
    },
    update: async (id, data) => {
        /* PUT /v1/catalog/service-models/{id} */
    },
    delete: (id) => {
        /* DELETE /v1/catalog/service-models/{id} */
    },
};
```

### 3.2 Crear `frontend/lib/api/architecture.ts`

```typescript
export const businessCapabilitiesApi = { ... };
export const entitiesApi = { ... };
export const systemsApi = { ... };
```

### 3.3 Crear `frontend/lib/api/users.ts`

```typescript
export const usersApi = {
    getAll: async (page = 1) => {
        /* /v1/organization/users */
    },
    getById: async (id: number) => {
        /* /v1/organization/users/{id} */
    },
    // ...
};
```

### 3.4 Crear `frontend/lib/api/ci-cd.ts`

```typescript
export const workflowsApi = {
    // Workflow Runs
    getRuns: async (page = 1) => {
        /* /v1/ci-cd/workflows/runs */
    },
    getRunById: async (id: number) => {
        /* /v1/ci-cd/workflows/runs/{id} */
    },

    // Workflow Commits
    getCommits: async (page = 1) => {
        /* /v1/ci-cd/workflows/commits */
    },
    getCommitById: async (id: number) => {
        /* /v1/ci-cd/workflows/commits/{id} */
    },

    // Workflow Jobs
    getJobs: async (workflowId: number) => {
        /* /v1/ci-cd/workflows/{id}/jobs */
    },
};
```

---

## 📁 FASE 4: Actualizar Exportaciones (`frontend/lib/api/index.ts`)

```typescript
// Nuevas exportaciones a agregar
export { serviceModelsApi } from "./service-models";
export {
    businessCapabilitiesApi,
    entitiesApi,
    systemsApi,
} from "./architecture";
export { usersApi } from "./users";
export { workflowsApi } from "./ci-cd";
```

---

## 📁 FASE 5: Actualizar Tests

### Archivos de test a actualizar:

1. `frontend/__tests__/infrastructure-module.test.ts` - Actualizar rutas
2. `frontend/__tests__/integration-module.test.ts` - Actualizar rutas
3. `frontend/__tests__/platform-module.test.ts` - Actualizar rutas
4. `frontend/__tests__/security-module.test.ts` - Actualizar rutas
5. `frontend/__tests__/new-api-modules.test.ts` - Actualizar rutas
6. `frontend/__tests__/api-schemas.test.ts` - Agregar nuevos schemas

---

## ✅ Checklist de Implementación

### Fase 1: Actualizar Rutas (CRÍTICO)

-   [ ] `infrastructure.ts` - Actualizar todas las rutas a `/v1/infrastructure/...`
-   [ ] `apis.ts` - Actualizar rutas a `/v1/catalog/apis`
-   [ ] `api-extended.ts` - Actualizar rutas a `/v1/catalog/apis/...`
-   [ ] `api-types.ts` - Actualizar rutas a `/v1/catalog/apis/types`
-   [ ] `platform.ts` - Actualizar rutas a `/v1/catalog/...`
-   [ ] `integration.ts` - Actualizar rutas a `/v1/catalog/links...`
-   [ ] `business.ts` - Actualizar rutas a `/v1/architecture/...` y `/v1/catalog/...`
-   [ ] `technology.ts` - Dividir rutas entre dominios
-   [ ] `programming-languages.ts` - Actualizar a `/v1/catalog/...`
-   [ ] `lifecycles.ts` - Actualizar a `/v1/architecture/lifecycles`
-   [ ] `groups.ts` - Actualizar a `/v1/organization/groups...`
-   [ ] `resources.ts` - Actualizar a `/v1/catalog/resources...`
-   [ ] `security.ts` - Actualizar a `/v1/security/...`
-   [ ] `service-accounts.ts` - Actualizar a `/v1/security/...`
-   [ ] `compliance.ts` - Actualizar a `/v1/compliance/...` y `/v1/operations/...`
-   [ ] `components.ts` - Actualizar a `/v1/catalog/components`

### Fase 2: Tipos TypeScript

-   [ ] Agregar `ServiceModel` schema y tipos
-   [ ] Agregar `Entity` y `EntityAttribute` schemas
-   [ ] Agregar `System` schema
-   [ ] Agregar `BusinessCapability` schema
-   [ ] Agregar `WorkflowRun` y `WorkflowJob` schemas
-   [ ] Actualizar `is_active` → `is_enabled` donde aplique

### Fase 3: Nuevos Módulos

-   [ ] Crear `service-models.ts`
-   [ ] Crear `architecture.ts`
-   [ ] Crear `users.ts`
-   [ ] Crear `ci-cd.ts`

### Fase 4: Exportaciones

-   [ ] Actualizar `index.ts` con nuevas exportaciones

### Fase 5: Tests

-   [ ] Actualizar tests existentes
-   [ ] Crear tests para nuevos módulos

---

## 🚀 Orden de Ejecución Recomendado

1. **Primero**: Crear constantes de rutas base para evitar errores de tipeo
2. **Segundo**: Actualizar archivos API existentes (Fase 1)
3. **Tercero**: Ejecutar tests para detectar errores
4. **Cuarto**: Agregar nuevos tipos (Fase 2)
5. **Quinto**: Crear nuevos módulos (Fase 3)
6. **Sexto**: Actualizar exportaciones (Fase 4)
7. **Séptimo**: Actualizar y crear tests (Fase 5)

---

## ⚠️ Consideraciones Importantes

1. **Backward Compatibility**: Las rutas antiguas ya no funcionarán. Este es un cambio breaking.

2. **Migración gradual**: Se puede crear un archivo de configuración para manejar las rutas de forma centralizada.

3. **Enums nuevos del backend**:

    - `RequiredBy` / `Requires` - Enums para relaciones inversas
    - `ServiceModel` - IaaS, PaaS, SaaS, FaaS

4. **Campo renombrado**: `is_active` → `is_enabled` en modelo `Entity`

5. **Nuevas relaciones disponibles**:
    - `clusters/{id}/nodes`
    - `clusters/{id}/service-accounts`
    - `platforms/{platform}/components`
    - `business-domains/{id}/components`
    - `business-domains/{id}/entities`
    - `business-capabilities/{id}/systems`
    - `lifecycles/{id}/components`
    - `systems/{id}/components`
    - `apis/{api}/components`
