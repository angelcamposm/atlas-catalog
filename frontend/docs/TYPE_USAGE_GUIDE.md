# Guía de Uso: Nuevos Tipos de Atlas Catalog

Esta guía proporciona ejemplos prácticos de cómo usar los tipos actualizados en el frontend.

## 📚 Tabla de Contenidos

1. [Importaciones Básicas](#importaciones-básicas)
2. [Validación con Zod](#validación-con-zod)
3. [Componentes](#componentes)
4. [APIs](#apis)
5. [Infraestructura](#infraestructura)
6. [Builds y Deployments](#builds-y-deployments)
7. [Gestión de Grupos](#gestión-de-grupos)
8. [Formularios](#formularios)

## Importaciones Básicas

```typescript
// Tipos de entidades
import type { Component, Api, Cluster, Release, Deployment } from "@/types/api";

// Enumeraciones
import {
    AccessPolicy,
    AuthorizationMethod,
    Protocol,
    DiscoverySource,
    WorkloadKind,
} from "@/types/api";

// Schemas para validación
import { apiSchema, componentSchema, releaseSchema } from "@/types/api";

// Tipos de requests
import type {
    CreateApiRequest,
    UpdateComponentRequest,
    CreateReleaseRequest,
} from "@/types/api";

// Tipos de respuestas paginadas
import type {
    PaginatedApiResponse,
    PaginatedComponentResponse,
} from "@/types/api";
```

## Validación con Zod

### Validar una respuesta de API

```typescript
import { apiSchema } from "@/types/api";

async function fetchApi(id: number) {
    const response = await fetch(`/api/v1/apis/${id}`);
    const data = await response.json();

    // Validar con Zod
    const result = apiSchema.safeParse(data.data);

    if (!result.success) {
        console.error("Errores de validación:", result.error.issues);
        throw new Error("Datos de API inválidos");
    }

    // Ahora tenemos datos tipados y validados
    const api = result.data;
    console.log(`API: ${api.name} (${api.version})`);
    return api;
}
```

### Validar array de datos

```typescript
import { z } from "zod";
import { componentSchema } from "@/types/api";

const componentsArraySchema = z.array(componentSchema);

function validateComponents(data: unknown) {
    const result = componentsArraySchema.safeParse(data);

    if (!result.success) {
        // Manejar errores
        result.error.issues.forEach((issue) => {
            console.error(`Campo ${issue.path.join(".")}: ${issue.message}`);
        });
        return null;
    }

    return result.data;
}
```

## Componentes

### Crear un nuevo componente

```typescript
import { CreateComponentRequest, DiscoverySource } from "@/types/api";

const newComponent: CreateComponentRequest = {
    name: "payment-service",
    slug: "payment-service",
    display_name: "Payment Service",
    description: "Servicio de procesamiento de pagos",

    // Referencias a otras entidades
    type_id: 1, // ComponentCategory
    platform_id: 2, // Platform (e.g., Kubernetes)
    lifecycle_id: 3, // Lifecycle (e.g., Production)
    domain_id: 4, // BusinessDomain (e.g., Payments)
    tier_id: 1, // BusinessTier (e.g., Tier 1)
    criticality_id: 1, // BusinessCriticalityLevel (e.g., Critical)
    owner_id: 10, // Group ID
    status_id: 1, // ServiceStatus (e.g., Active)
    operational_status_id: 1, // OperationalStatus (e.g., Running)

    // Características
    discovery_source: DiscoverySource.PIPELINE,
    is_stateless: true,
    has_zero_downtime_deployment: true,

    // Metadata
    tags: {
        team: "payments",
        language: "java",
        framework: "spring-boot",
        database: "postgresql",
    },
};

// Enviar al backend
async function createComponent(data: CreateComponentRequest) {
    const response = await fetch("/api/v1/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return response.json();
}
```

### Actualizar un componente

```typescript
import { UpdateComponentRequest } from "@/types/api";

const updates: UpdateComponentRequest = {
    description: "Servicio mejorado de procesamiento de pagos",
    lifecycle_id: 4, // Cambiar a otro lifecycle
    tags: {
        ...existingComponent.tags,
        version: "2.0.0",
        migration: "in-progress",
    },
};

async function updateComponent(id: number, data: UpdateComponentRequest) {
    const response = await fetch(`/api/v1/components/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return response.json();
}
```

### Listar componentes con filtros

```typescript
import type { PaginatedComponentResponse } from "@/types/api";

interface ComponentFilters {
    platform_id?: number;
    lifecycle_id?: number;
    domain_id?: number;
    is_stateless?: boolean;
    page?: number;
}

async function listComponents(
    filters: ComponentFilters = {}
): Promise<PaginatedComponentResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
            params.append(key, String(value));
        }
    });

    const response = await fetch(`/api/v1/components?${params}`);
    return response.json();
}

// Uso
const statelessComponents = await listComponents({
    is_stateless: true,
    platform_id: 2,
    page: 1,
});

console.log(`Total: ${statelessComponents.meta.total}`);
statelessComponents.data.forEach((component) => {
    console.log(`- ${component.name}`);
});
```

## APIs

### Crear una API REST

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

    // Enumeraciones
    access_policy: AccessPolicy.INTERNAL,
    auth_method: AuthorizationMethod.OAUTH,
    protocol: Protocol.HTTPS,

    // Referencias
    type_id: 1, // ApiType (e.g., REST)
    category_id: 2, // ApiCategory (e.g., Business)
    status_id: 1, // ApiStatus (e.g., Active)

    // Versión
    version: "v1.0.0",

    // OpenAPI Specification
    document_specification: {
        openapi: "3.0.0",
        info: {
            title: "Users API",
            version: "1.0.0",
            description: "API para gestión de usuarios",
        },
        servers: [{ url: "https://api.example.com/v1" }],
        paths: {
            "/users": {
                get: {
                    summary: "List users",
                    responses: {
                        "200": {
                            description: "Success",
                        },
                    },
                },
            },
        },
    },

    // Compliance
    compliance: "GDPR,SOC2",
    compliance_status: "compliant",
};
```

### Deprecar una API

```typescript
import { UpdateApiRequest } from "@/types/api";

async function deprecateApi(apiId: number, reason: string) {
    const updates: UpdateApiRequest = {
        deprecated_at: new Date().toISOString(),
        deprecated_by: currentUserId,
        deprecation_reason: reason,
        status_id: deprecatedStatusId, // Cambiar a status "Deprecated"
    };

    const response = await fetch(`/api/v1/apis/${apiId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    return response.json();
}

// Uso
await deprecateApi(123, "Migrated to GraphQL API");
```

### API Pública vs Interna

```typescript
import { AccessPolicy } from "@/types/api";

function getApiAccessBadge(api: Api) {
    switch (api.access_policy) {
        case AccessPolicy.PUBLIC:
            return {
                color: "green",
                label: "Público",
                description: "Accesible desde internet",
            };
        case AccessPolicy.INTERNAL:
            return {
                color: "blue",
                label: "Interno",
                description: "Solo red corporativa",
            };
        case AccessPolicy.THIRD_PARTY:
            return {
                color: "purple",
                label: "Terceros",
                description: "Acceso para partners",
            };
    }
}
```

## Infraestructura

### Crear un Cluster

```typescript
import { CreateClusterRequest } from "@/types/api";

const newCluster: CreateClusterRequest = {
    name: "prod-k8s-us-east",
    display_name: "Production Kubernetes - US East",
    version: "1.28.0",

    type_id: 1, // ClusterType (e.g., Kubernetes)
    lifecycle_id: 3, // Lifecycle (e.g., Production)

    api_url: "https://k8s-api.prod.us-east.example.com",
    full_version: "v1.28.0+k3s1",
    timezone: "America/New_York",

    tags: {
        region: "us-east-1",
        provider: "aws",
        managed: "true",
        ha: "true",
    },
};
```

### Crear un Nodo

```typescript
import { CreateNodeRequest } from "@/types/api";

const newNode: CreateNodeRequest = {
    name: "worker-01",
    ip_address: "10.0.1.10",
    fqdn: "worker-01.prod.example.com",

    // Especificaciones de hardware
    cpu_architecture: "x86_64",
    cpu_count: 16,
    cpu_sockets: 2,
    cpu_type: "Intel Xeon",
    memory_bytes: 64 * 1024 * 1024 * 1024, // 64 GB

    // Sistema operativo
    os: "Ubuntu",
    os_version: "22.04 LTS",

    // Tipo y estado
    node_type: "V", // Virtual
    is_virtual: true,
    lifecycle_id: 3, // Production
    operational_status_id: 1, // Running

    // Descubrimiento
    discovery_source: "SCAN",
    timezone: "UTC",
};
```

### Asociar Nodo a Cluster

```typescript
// Primero obtener el cluster y el nodo
const cluster = await fetchCluster(clusterId);
const node = await fetchNode(nodeId);

// Crear la relación
const clusterNode = {
    cluster_id: cluster.id,
    node_id: node.id,
    role: "worker", // o "master", "etcd"
};

await fetch("/api/v1/cluster-nodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clusterNode),
});
```

## Builds y Deployments

### Crear un Build

```typescript
import { CreateBuildRequest, BuildResult } from "@/types/api";

const newBuild: CreateBuildRequest = {
    component_id: 42,
    job_id: "jenkins-build-1234",
    launched_at: new Date().toISOString(),
    launched_by: currentUserId,
    finished_at: new Date(Date.now() + 300000).toISOString(), // +5 min
    result: BuildResult.SUCCESS,
};
```

### Crear un Release

```typescript
import { CreateReleaseRequest } from "@/types/api";

const newRelease: CreateReleaseRequest = {
    component_id: 42,
    build_id: 123,

    // Lenguaje y framework
    language_id: 5, // Java
    framework_id: 10, // Spring Boot

    // Artifact
    url: "https://registry.example.com/payment-service:v2.1.0",

    // Checksums
    digest_md5: "abc123...",
    digest_sha1: "def456...",
    digest_sha256: "ghi789...",

    // SBOM (Software Bill of Materials)
    sbom_ref: "https://sbom.example.com/payment-service/v2.1.0",
    sbom_digest: "sha256:xyz...",
};
```

### Crear un Deployment

```typescript
import { CreateDeploymentRequest } from "@/types/api";

const newDeployment: CreateDeploymentRequest = {
    release_id: 456,
    environment_id: 3, // Production
    deployed_at: new Date().toISOString(),
    deployed_by: currentUserId,
    deployment_model: "rolling",
    deployment_status: "success",
};
```

### Pipeline Completo: Build → Release → Deploy

```typescript
async function deployPipeline(componentId: number, environmentId: number) {
    // 1. Crear Build
    const build = await createBuild({
        component_id: componentId,
        job_id: `jenkins-${Date.now()}`,
        launched_at: new Date().toISOString(),
        launched_by: currentUserId,
        finished_at: new Date().toISOString(),
        result: BuildResult.SUCCESS,
    });

    console.log(`✅ Build created: ${build.data.id}`);

    // 2. Crear Release
    const release = await createRelease({
        component_id: componentId,
        build_id: build.data.id,
        language_id: 5,
        framework_id: 10,
        url: `registry.example.com/app:build-${build.data.id}`,
        digest_sha256: calculateSHA256(),
    });

    console.log(`✅ Release created: ${release.data.id}`);

    // 3. Crear Deployment
    const deployment = await createDeployment({
        release_id: release.data.id,
        environment_id: environmentId,
        deployed_at: new Date().toISOString(),
        deployed_by: currentUserId,
        deployment_model: "rolling",
        deployment_status: "in-progress",
    });

    console.log(`✅ Deployment created: ${deployment.data.id}`);

    return { build, release, deployment };
}
```

## Gestión de Grupos

### Crear un Grupo

```typescript
import { CreateGroupRequest } from "@/types/api";

const newGroup: CreateGroupRequest = {
    name: "platform-team",
    description: "Platform Engineering Team",
    email: "platform@example.com",
    icon: "users",
    label: "Platform",
    type_id: 1, // GroupType (e.g., "Engineering Team")
    parent_id: null, // Es un grupo raíz
};
```

### Crear un Subgrupo

```typescript
const subGroup: CreateGroupRequest = {
    name: "platform-team-backend",
    description: "Backend Engineers",
    email: "platform-backend@example.com",
    icon: "code",
    label: "Backend",
    type_id: 1,
    parent_id: platformTeamId, // Grupo padre
};
```

### Agregar Miembro a un Grupo

```typescript
const newMember = {
    team_id: platformTeamId,
    user_id: userId,
    role_id: 2, // GroupMemberRole (e.g., "Developer")
    is_active: true,
};

await fetch("/api/v1/group-members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMember),
});
```

## Formularios

### Formulario de Componente con React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateComponentRequest, DiscoverySource } from "@/types/api";

// Schema de validación para el formulario
const componentFormSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    slug: z
        .string()
        .min(1, "El slug es requerido")
        .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
    display_name: z.string().optional(),
    description: z.string().optional(),
    type_id: z.number().int().positive("Seleccione un tipo"),
    platform_id: z.number().int().positive("Seleccione una plataforma"),
    is_stateless: z.boolean().default(false),
    has_zero_downtime_deployment: z.boolean().default(false),
});

type ComponentFormData = z.infer<typeof componentFormSchema>;

function ComponentForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ComponentFormData>({
        resolver: zodResolver(componentFormSchema),
        defaultValues: {
            is_stateless: false,
            has_zero_downtime_deployment: false,
        },
    });

    const onSubmit = async (data: ComponentFormData) => {
        const payload: CreateComponentRequest = {
            ...data,
            discovery_source: DiscoverySource.MANUAL,
            tags: {},
        };

        try {
            const response = await fetch("/api/v1/components", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log("✅ Componente creado");
            }
        } catch (error) {
            console.error("❌ Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name")} placeholder="Nombre" />
            {errors.name && <span>{errors.name.message}</span>}

            <input {...register("slug")} placeholder="Slug" />
            {errors.slug && <span>{errors.slug.message}</span>}

            <select {...register("type_id", { valueAsNumber: true })}>
                <option value="">Seleccione tipo...</option>
                {/* Opciones dinámicas */}
            </select>

            <label>
                <input type="checkbox" {...register("is_stateless")} />
                Stateless
            </label>

            <button type="submit">Crear Componente</button>
        </form>
    );
}
```

### Formulario de API

```typescript
import {
    CreateApiRequest,
    AccessPolicy,
    AuthorizationMethod,
    Protocol,
} from "@/types/api";

function ApiForm() {
    const [formData, setFormData] = useState<Partial<CreateApiRequest>>({
        access_policy: AccessPolicy.INTERNAL,
        auth_method: AuthorizationMethod.OAUTH,
        protocol: Protocol.HTTPS,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: CreateApiRequest = {
            name: formData.name!,
            access_policy: formData.access_policy!,
            auth_method: formData.auth_method!,
            protocol: formData.protocol!,
            description: formData.description,
            version: formData.version || "v1.0.0",
        };

        await fetch("/api/v1/apis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <select
                value={formData.access_policy}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        access_policy: e.target.value as AccessPolicy,
                    })
                }
            >
                <option value={AccessPolicy.PUBLIC}>Público</option>
                <option value={AccessPolicy.INTERNAL}>Interno</option>
                <option value={AccessPolicy.THIRD_PARTY}>Terceros</option>
            </select>

            <select
                value={formData.auth_method}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        auth_method: e.target.value as AuthorizationMethod,
                    })
                }
            >
                <option value={AuthorizationMethod.BASIC}>Basic Auth</option>
                <option value={AuthorizationMethod.OAUTH}>OAuth 2.0</option>
                <option value={AuthorizationMethod.KEY}>API Key</option>
                <option value={AuthorizationMethod.NONE}>
                    Sin autenticación
                </option>
            </select>

            {/* Más campos... */}

            <button type="submit">Crear API</button>
        </form>
    );
}
```

## Tips y Mejores Prácticas

### 1. Siempre Validar Respuestas de API

```typescript
import { apiSchema } from "@/types/api";

async function fetchApi(id: number) {
    const response = await fetch(`/api/v1/apis/${id}`);
    const json = await response.json();

    // Validar antes de usar
    const validated = apiSchema.parse(json.data);
    return validated;
}
```

### 2. Usar Type Guards

```typescript
import type { Component } from "@/types/api";
import { DiscoverySource } from "@/types/api";

function isManuallyDiscovered(component: Component): boolean {
    return component.discovery_source === DiscoverySource.MANUAL;
}

function isCritical(component: Component): boolean {
    return component.criticality_id === 1;
}
```

### 3. Crear Helpers para Enums

```typescript
import { AccessPolicy, AuthorizationMethod } from "@/types/api";

export const accessPolicyLabels: Record<AccessPolicy, string> = {
    [AccessPolicy.PUBLIC]: "Público",
    [AccessPolicy.INTERNAL]: "Interno",
    [AccessPolicy.THIRD_PARTY]: "Terceros",
};

export const authMethodLabels: Record<AuthorizationMethod, string> = {
    [AuthorizationMethod.BASIC]: "Basic Authentication",
    [AuthorizationMethod.OAUTH]: "OAuth 2.0",
    [AuthorizationMethod.KEY]: "API Key",
    [AuthorizationMethod.NONE]: "Sin autenticación",
};
```

### 4. Partial Updates Seguros

```typescript
import type { Component, UpdateComponentRequest } from "@/types/api";

function updateComponentSafely(
    original: Component,
    updates: UpdateComponentRequest
): UpdateComponentRequest {
    // Solo enviar campos que realmente cambiaron
    const changed: UpdateComponentRequest = {};

    (Object.keys(updates) as Array<keyof UpdateComponentRequest>).forEach(
        (key) => {
            if (updates[key] !== original[key]) {
                changed[key] = updates[key] as any;
            }
        }
    );

    return changed;
}
```

---

**Nota**: Esta guía se actualizará conforme se agreguen más funcionalidades al sistema.
