# Plan de Implementación Frontend - Nuevas APIs

## 🎯 Objetivo

Integrar todas las nuevas APIs del backend en el frontend de Next.js, permitiendo la gestión completa de:

-   Infrastructure (Clusters, Nodes)
-   Platform (Platforms, ComponentTypes)
-   Integration (Links, LinkTypes)
-   Extended Security (ServiceAccountTokens)

## 📋 Fases de Implementación

### Fase 1: Tipos TypeScript y Esquemas (Prioridad Alta) ⭐

**Objetivo**: Definir todos los tipos TypeScript para las nuevas APIs

#### 1.1 Crear Tipos Base (`frontend/types/api.ts`)

```typescript
// Infrastructure Domain
export interface Cluster {
    id: number;
    name: string;
    description: string | null;
    cluster_type_id: number;
    cluster_type?: ClusterType;
    version: string;
    endpoint: string;
    is_active: boolean;
    nodes?: Node[];
    service_accounts?: ClusterServiceAccount[];
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export interface ClusterType {
    id: number;
    name: string;
    description: string | null;
    licensing_model: "open_source" | "commercial" | "hybrid";
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export interface Node {
    id: number;
    name: string;
    hostname: string;
    ip_address: string;
    node_type: "physical" | "virtual" | "cloud";
    node_role: "master" | "worker" | "etcd";
    cpu_cores: number;
    cpu_architecture: "x86_64" | "arm64" | "arm" | "ppc64le";
    memory_bytes: number;
    storage_bytes: number;
    environment_id: number;
    environment?: Environment;
    is_active: boolean;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export interface ClusterServiceAccount {
    id: number;
    cluster_id: number;
    service_account_id: number;
    namespace: string;
    is_active: boolean;
    cluster?: Cluster;
    service_account?: ServiceAccount;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

// Platform Domain
export interface Platform {
    id: number;
    name: string;
    description: string | null;
    vendor_id: number | null;
    vendor?: Vendor;
    version: string | null;
    url: string | null;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export interface ComponentType {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

// Integration Domain
export interface Link {
    id: number;
    name: string;
    description: string | null;
    link_type_id: number;
    link_type?: LinkType;
    source_type: string;
    source_id: number;
    target_type: string;
    target_id: number;
    protocol: "http" | "https" | "grpc" | "tcp" | "udp" | "websocket";
    communication_style:
        | "synchronous"
        | "asynchronous"
        | "event_driven"
        | "batch";
    endpoint: string | null;
    is_active: boolean;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export interface LinkType {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

// Security Domain Extended
export interface ServiceAccountToken {
    id: number;
    service_account_id: number;
    service_account?: ServiceAccount;
    token: string;
    expires_at: string | null;
    is_active: boolean;
    last_used_at: string | null;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

// Enums
export enum NodeType {
    Physical = "physical",
    Virtual = "virtual",
    Cloud = "cloud",
}

export enum NodeRole {
    Master = "master",
    Worker = "worker",
    Etcd = "etcd",
}

export enum CpuArchitecture {
    X86_64 = "x86_64",
    ARM64 = "arm64",
    ARM = "arm",
    PPC64LE = "ppc64le",
}

export enum Protocol {
    HTTP = "http",
    HTTPS = "https",
    GRPC = "grpc",
    TCP = "tcp",
    UDP = "udp",
    WebSocket = "websocket",
}

export enum CommunicationStyle {
    Synchronous = "synchronous",
    Asynchronous = "asynchronous",
    EventDriven = "event_driven",
    Batch = "batch",
}

export enum LicensingModel {
    OpenSource = "open_source",
    Commercial = "commercial",
    Hybrid = "hybrid",
}
```

**Archivos a modificar**:

-   `frontend/types/api.ts` - Agregar todas las interfaces

**Tiempo estimado**: 2-3 horas

---

### Fase 2: Cliente API (Prioridad Alta) ⭐

**Objetivo**: Crear funciones para consumir las nuevas APIs

#### 2.1 Crear Módulo de Infrastructure (`frontend/lib/api/infrastructure.ts`)

```typescript
import { apiClient } from "../api-client";
import type {
    Cluster,
    ClusterType,
    Node,
    ClusterServiceAccount,
    PaginatedResponse,
} from "@/types/api";

export const infrastructureApi = {
    // Clusters
    clusters: {
        getAll: (page = 1) =>
            apiClient.get<PaginatedResponse<Cluster>>(
                `/v1/clusters?page=${page}`
            ),

        getById: (id: number) => apiClient.get<Cluster>(`/v1/clusters/${id}`),

        create: (data: Partial<Cluster>) =>
            apiClient.post<Cluster>("/v1/clusters", data),

        update: (id: number, data: Partial<Cluster>) =>
            apiClient.put<Cluster>(`/v1/clusters/${id}`, data),

        delete: (id: number) => apiClient.delete(`/v1/clusters/${id}`),
    },

    // Cluster Types
    clusterTypes: {
        getAll: (page = 1) =>
            apiClient.get<PaginatedResponse<ClusterType>>(
                `/v1/cluster-types?page=${page}`
            ),

        getById: (id: number) =>
            apiClient.get<ClusterType>(`/v1/cluster-types/${id}`),

        create: (data: Partial<ClusterType>) =>
            apiClient.post<ClusterType>("/v1/cluster-types", data),

        update: (id: number, data: Partial<ClusterType>) =>
            apiClient.put<ClusterType>(`/v1/cluster-types/${id}`, data),

        delete: (id: number) => apiClient.delete(`/v1/cluster-types/${id}`),
    },

    // Nodes
    nodes: {
        getAll: (page = 1) =>
            apiClient.get<PaginatedResponse<Node>>(`/v1/nodes?page=${page}`),

        getById: (id: number) => apiClient.get<Node>(`/v1/nodes/${id}`),

        create: (data: Partial<Node>) =>
            apiClient.post<Node>("/v1/nodes", data),

        update: (id: number, data: Partial<Node>) =>
            apiClient.put<Node>(`/v1/nodes/${id}`, data),

        delete: (id: number) => apiClient.delete(`/v1/nodes/${id}`),
    },

    // Cluster Service Accounts
    clusterServiceAccounts: {
        getAll: (page = 1) =>
            apiClient.get<PaginatedResponse<ClusterServiceAccount>>(
                `/v1/cluster-service-accounts?page=${page}`
            ),

        getById: (id: number) =>
            apiClient.get<ClusterServiceAccount>(
                `/v1/cluster-service-accounts/${id}`
            ),

        create: (data: Partial<ClusterServiceAccount>) =>
            apiClient.post<ClusterServiceAccount>(
                "/v1/cluster-service-accounts",
                data
            ),

        update: (id: number, data: Partial<ClusterServiceAccount>) =>
            apiClient.put<ClusterServiceAccount>(
                `/v1/cluster-service-accounts/${id}`,
                data
            ),

        delete: (id: number) =>
            apiClient.delete(`/v1/cluster-service-accounts/${id}`),
    },
};
```

#### 2.2 Crear Módulo de Platform (`frontend/lib/api/platform.ts`)

```typescript
import { apiClient } from "../api-client";
import type { Platform, ComponentType, PaginatedResponse } from "@/types/api";

export const platformApi = {
    // Platforms
    platforms: {
        getAll: (page = 1) =>
            apiClient.get<PaginatedResponse<Platform>>(
                `/v1/platforms?page=${page}`
            ),

        getById: (id: number) => apiClient.get<Platform>(`/v1/platforms/${id}`),

        create: (data: Partial<Platform>) =>
            apiClient.post<Platform>("/v1/platforms", data),

        update: (id: number, data: Partial<Platform>) =>
            apiClient.put<Platform>(`/v1/platforms/${id}`, data),

        delete: (id: number) => apiClient.delete(`/v1/platforms/${id}`),
    },

    // Component Types
    componentTypes: {
        getAll: (page = 1) =>
            apiClient.get<PaginatedResponse<ComponentType>>(
                `/v1/component-types?page=${page}`
            ),

        getById: (id: number) =>
            apiClient.get<ComponentType>(`/v1/component-types/${id}`),

        create: (data: Partial<ComponentType>) =>
            apiClient.post<ComponentType>("/v1/component-types", data),

        update: (id: number, data: Partial<ComponentType>) =>
            apiClient.put<ComponentType>(`/v1/component-types/${id}`, data),

        delete: (id: number) => apiClient.delete(`/v1/component-types/${id}`),
    },
};
```

#### 2.3 Crear Módulo de Integration (`frontend/lib/api/integration.ts`)

```typescript
import { apiClient } from "../api-client";
import type { Link, LinkType, PaginatedResponse } from "@/types/api";

export const integrationApi = {
    // Links
    links: {
        getAll: (page = 1) =>
            apiClient.get<PaginatedResponse<Link>>(`/v1/links?page=${page}`),

        getById: (id: number) => apiClient.get<Link>(`/v1/links/${id}`),

        create: (data: Partial<Link>) =>
            apiClient.post<Link>("/v1/links", data),

        update: (id: number, data: Partial<Link>) =>
            apiClient.put<Link>(`/v1/links/${id}`, data),

        delete: (id: number) => apiClient.delete(`/v1/links/${id}`),
    },

    // Link Types
    linkTypes: {
        getAll: (page = 1) =>
            apiClient.get<PaginatedResponse<LinkType>>(
                `/v1/link-types?page=${page}`
            ),

        getById: (id: number) =>
            apiClient.get<LinkType>(`/v1/link-types/${id}`),

        create: (data: Partial<LinkType>) =>
            apiClient.post<LinkType>("/v1/link-types", data),

        update: (id: number, data: Partial<LinkType>) =>
            apiClient.put<LinkType>(`/v1/link-types/${id}`, data),

        delete: (id: number) => apiClient.delete(`/v1/link-types/${id}`),
    },
};
```

**Archivos a crear**:

-   `frontend/lib/api/infrastructure.ts`
-   `frontend/lib/api/platform.ts`
-   `frontend/lib/api/integration.ts`
-   `frontend/lib/api/security.ts` (para tokens)

**Tiempo estimado**: 3-4 horas

---

### Fase 3: Componentes UI Básicos (Prioridad Media)

**Objetivo**: Crear componentes reutilizables para las nuevas entidades

#### 3.1 Componentes de Tablas

**Archivos a crear**:

-   `frontend/components/infrastructure/ClusterList.tsx`
-   `frontend/components/infrastructure/NodeList.tsx`
-   `frontend/components/platform/PlatformList.tsx`
-   `frontend/components/integration/LinkList.tsx`

**Ejemplo**: `ClusterList.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { infrastructureApi } from "@/lib/api/infrastructure";
import type { Cluster } from "@/types/api";
import { HiServerStack } from "react-icons/hi2";

export function ClusterList() {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadClusters();
    }, [page]);

    const loadClusters = async () => {
        try {
            setLoading(true);
            const response = await infrastructureApi.clusters.getAll(page);
            setClusters(response.data);
        } catch (error) {
            console.error("Error loading clusters:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading clusters...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Kubernetes Clusters</h2>
            <div className="grid gap-4">
                {clusters.map((cluster) => (
                    <div key={cluster.id} className="card p-4">
                        <div className="flex items-start gap-3">
                            <HiServerStack className="text-2xl text-primary" />
                            <div>
                                <h3 className="font-semibold">
                                    {cluster.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {cluster.description}
                                </p>
                                <div className="mt-2 flex gap-2">
                                    <span className="badge">
                                        {cluster.version}
                                    </span>
                                    {cluster.is_active ? (
                                        <span className="badge badge-success">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="badge badge-error">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

**Tiempo estimado**: 6-8 horas

#### 3.2 Componentes de Formularios

**Archivos a crear**:

-   `frontend/components/infrastructure/CreateClusterForm.tsx`
-   `frontend/components/infrastructure/CreateNodeForm.tsx`
-   `frontend/components/platform/CreatePlatformForm.tsx`
-   `frontend/components/integration/CreateLinkForm.tsx`

**Tiempo estimado**: 8-10 horas

---

### Fase 4: Páginas y Rutas (Prioridad Media)

**Objetivo**: Crear las páginas para gestionar las nuevas entidades

#### 4.1 Estructura de Rutas

```
app/[locale]/(protected)/
├── infrastructure/
│   ├── page.tsx              # Dashboard de infraestructura
│   ├── clusters/
│   │   ├── page.tsx          # Lista de clusters
│   │   ├── [id]/
│   │   │   └── page.tsx      # Detalle de cluster
│   │   └── new/
│   │       └── page.tsx      # Crear cluster
│   └── nodes/
│       ├── page.tsx          # Lista de nodos
│       ├── [id]/
│       │   └── page.tsx      # Detalle de nodo
│       └── new/
│           └── page.tsx      # Crear nodo
├── platform/
│   ├── page.tsx              # Dashboard de plataformas
│   └── platforms/
│       ├── page.tsx          # Lista de plataformas
│       └── [id]/
│           └── page.tsx      # Detalle de plataforma
└── integration/
    ├── page.tsx              # Dashboard de integraciones
    └── links/
        ├── page.tsx          # Lista de enlaces
        ├── [id]/
        │   └── page.tsx      # Detalle de enlace
        └── new/
            └── page.tsx      # Crear enlace
```

**Archivos a crear**: ~15 páginas

**Tiempo estimado**: 10-12 horas

---

### Fase 5: Dashboard y Visualizaciones (Prioridad Baja)

**Objetivo**: Agregar widgets al dashboard principal

#### 5.1 Widgets de Dashboard

**Archivos a crear**:

-   `frontend/components/dashboard/ClusterStatsWidget.tsx` - Estadísticas de clusters
-   `frontend/components/dashboard/NodeHealthWidget.tsx` - Salud de nodos
-   `frontend/components/dashboard/IntegrationMapWidget.tsx` - Mapa de integraciones
-   `frontend/components/dashboard/PlatformOverviewWidget.tsx` - Overview de plataformas

**Ejemplo**: `ClusterStatsWidget.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { infrastructureApi } from "@/lib/api/infrastructure";
import { HiServerStack } from "react-icons/hi2";

export function ClusterStatsWidget() {
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const response = await infrastructureApi.clusters.getAll(1);
        const clusters = response.data;

        setStats({
            total: clusters.length,
            active: clusters.filter((c) => c.is_active).length,
            inactive: clusters.filter((c) => !c.is_active).length,
        });
    };

    return (
        <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
                <HiServerStack className="text-3xl text-primary" />
                <h3 className="text-xl font-bold">Clusters</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                        {stats.active}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Inactive</p>
                    <p className="text-2xl font-bold text-red-600">
                        {stats.inactive}
                    </p>
                </div>
            </div>
        </div>
    );
}
```

**Tiempo estimado**: 6-8 horas

---

### Fase 6: Navegación y Menús (Prioridad Alta) ⭐

**Objetivo**: Agregar enlaces en el menú de navegación

#### 6.1 Actualizar Sidebar/Navigation

**Archivo a modificar**: `frontend/components/layout/Sidebar.tsx` o similar

```typescript
const menuItems = [
    // ... items existentes ...
    {
        title: "Infrastructure",
        icon: HiServerStack,
        items: [
            { title: "Clusters", href: "/infrastructure/clusters" },
            { title: "Nodes", href: "/infrastructure/nodes" },
            {
                title: "Service Accounts",
                href: "/infrastructure/service-accounts",
            },
        ],
    },
    {
        title: "Platform",
        icon: HiCubeTransparent,
        items: [
            { title: "Platforms", href: "/platform/platforms" },
            { title: "Components", href: "/platform/components" },
        ],
    },
    {
        title: "Integration",
        icon: HiLink,
        items: [
            { title: "Links", href: "/integration/links" },
            { title: "Link Types", href: "/integration/link-types" },
        ],
    },
];
```

**Tiempo estimado**: 1-2 horas

---

## 📊 Resumen de Estimaciones

| Fase      | Descripción      | Prioridad | Tiempo Estimado |
| --------- | ---------------- | --------- | --------------- |
| 1         | Tipos TypeScript | Alta ⭐   | 2-3 horas       |
| 2         | Cliente API      | Alta ⭐   | 3-4 horas       |
| 3         | Componentes UI   | Media     | 14-18 horas     |
| 4         | Páginas y Rutas  | Media     | 10-12 horas     |
| 5         | Dashboard        | Baja      | 6-8 horas       |
| 6         | Navegación       | Alta ⭐   | 1-2 horas       |
| **TOTAL** |                  |           | **36-47 horas** |

---

## 🚀 Orden de Implementación Recomendado

### Sprint 1: Fundamentos (Prioridad Alta)

1. ✅ Fase 1: Tipos TypeScript (2-3h)
2. ✅ Fase 2: Cliente API (3-4h)
3. ✅ Fase 6: Navegación (1-2h)

**Total Sprint 1**: 6-9 horas

### Sprint 2: Infrastructure Domain

1. Componentes de Clusters (4h)
2. Páginas de Clusters (3h)
3. Componentes de Nodes (4h)
4. Páginas de Nodes (3h)

**Total Sprint 2**: 14 horas

### Sprint 3: Platform & Integration

1. Componentes de Platform (3h)
2. Páginas de Platform (2h)
3. Componentes de Integration (4h)
4. Páginas de Integration (3h)

**Total Sprint 3**: 12 horas

### Sprint 4: Dashboard y Mejoras

1. Widgets de Dashboard (6-8h)
2. Mejoras de UX (4h)
3. Testing (4h)

**Total Sprint 4**: 14-16 horas

---

## 📁 Estructura de Archivos Final

```
frontend/
├── types/
│   └── api.ts                          # ✅ Tipos actualizados
├── lib/
│   └── api/
│       ├── infrastructure.ts           # ✅ Nuevo
│       ├── platform.ts                 # ✅ Nuevo
│       ├── integration.ts              # ✅ Nuevo
│       └── security.ts                 # ✅ Actualizado
├── components/
│   ├── infrastructure/                 # ✅ Nuevo
│   │   ├── ClusterList.tsx
│   │   ├── NodeList.tsx
│   │   ├── CreateClusterForm.tsx
│   │   └── CreateNodeForm.tsx
│   ├── platform/                       # ✅ Nuevo
│   │   ├── PlatformList.tsx
│   │   └── CreatePlatformForm.tsx
│   ├── integration/                    # ✅ Nuevo
│   │   ├── LinkList.tsx
│   │   └── CreateLinkForm.tsx
│   └── dashboard/
│       ├── ClusterStatsWidget.tsx      # ✅ Nuevo
│       ├── NodeHealthWidget.tsx        # ✅ Nuevo
│       └── IntegrationMapWidget.tsx    # ✅ Nuevo
└── app/[locale]/(protected)/
    ├── infrastructure/                 # ✅ Nuevo
    │   ├── page.tsx
    │   ├── clusters/
    │   └── nodes/
    ├── platform/                       # ✅ Nuevo
    │   ├── page.tsx
    │   └── platforms/
    └── integration/                    # ✅ Nuevo
        ├── page.tsx
        └── links/
```

---

## ✅ Checklist de Implementación

### Preparación

-   [ ] Revisar documentación del backend
-   [ ] Verificar que todas las rutas estén funcionando
-   [ ] Configurar variables de entorno

### Sprint 1: Fundamentos

-   [ ] Agregar tipos TypeScript para Cluster, Node, Platform, Link
-   [ ] Agregar enums (NodeType, NodeRole, Protocol, etc.)
-   [ ] Crear módulo infrastructureApi
-   [ ] Crear módulo platformApi
-   [ ] Crear módulo integrationApi
-   [ ] Actualizar navegación/sidebar

### Sprint 2: Infrastructure

-   [ ] Componente ClusterList
-   [ ] Componente NodeList
-   [ ] Componente CreateClusterForm
-   [ ] Componente CreateNodeForm
-   [ ] Página /infrastructure/clusters
-   [ ] Página /infrastructure/clusters/[id]
-   [ ] Página /infrastructure/nodes
-   [ ] Página /infrastructure/nodes/[id]

### Sprint 3: Platform & Integration

-   [ ] Componente PlatformList
-   [ ] Componente CreatePlatformForm
-   [ ] Componente LinkList
-   [ ] Componente CreateLinkForm
-   [ ] Página /platform/platforms
-   [ ] Página /integration/links
-   [ ] Página /integration/links/[id]

### Sprint 4: Dashboard

-   [ ] Widget ClusterStats
-   [ ] Widget NodeHealth
-   [ ] Widget IntegrationMap
-   [ ] Actualizar dashboard principal
-   [ ] Testing de componentes
-   [ ] Testing de integración

---

## 🎨 Consideraciones de Diseño

### Colores y Temas

-   Usar el sistema de temas existente
-   Iconos: react-icons/hi2 (HeroIcons v2)
-   Colores específicos:
    -   Infrastructure: Azul/Cyan
    -   Platform: Púrpura
    -   Integration: Verde

### Componentes Reutilizables

-   Usar componentes de `components/ui/`
-   Mantener consistencia con el diseño actual
-   Implementar estados de loading
-   Implementar manejo de errores

### Responsive Design

-   Mobile-first approach
-   Tablas responsivas con scroll horizontal
-   Formularios adaptables

---

## 🧪 Testing

### Unit Tests

-   Probar funciones del API client
-   Probar componentes individuales
-   Probar hooks personalizados

### Integration Tests

-   Probar flujos completos (crear → listar → editar → eliminar)
-   Probar navegación entre páginas
-   Probar estados de error

### E2E Tests (Opcional)

-   Flujo completo de creación de cluster
-   Flujo completo de creación de enlace

---

## 📚 Documentación

### Documentos a Crear/Actualizar

-   [ ] README del frontend con nuevas funcionalidades
-   [ ] Guía de uso de las nuevas páginas
-   [ ] Documentación de componentes (Storybook opcional)
-   [ ] Actualizar FRONTEND_EPICS.md

---

## 🔄 Integración Continua

### Pre-commit

-   Ejecutar linter
-   Ejecutar tests
-   Verificar tipos TypeScript

### CI/CD

-   Build del frontend
-   Tests automáticos
-   Deploy a staging

---

## 💡 Mejoras Futuras

### Fase 7: Características Avanzadas (Opcional)

1. Búsqueda avanzada y filtros
2. Exportación de datos (CSV, JSON)
3. Gráficos y visualizaciones avanzadas
4. Notificaciones en tiempo real
5. Historial de cambios (audit log)
6. Permisos y roles de usuario
7. API de GraphQL (opcional)

---

## 📞 Soporte y Referencias

### Documentación Útil

-   [Next.js 15 Docs](https://nextjs.org/docs)
-   [TypeScript Handbook](https://www.typescriptlang.org/docs/)
-   [React Icons](https://react-icons.github.io/react-icons/)
-   [Tailwind CSS](https://tailwindcss.com/docs)

### Recursos Internos

-   `docs/BACKEND_NEW_APIS.md` - Documentación de APIs
-   `docs/frontend-epics.md` - Épicas del frontend
-   `.github/copilot-instructions.md` - Guías del proyecto

---

## ✨ Conclusión

Este plan proporciona una hoja de ruta clara para integrar todas las nuevas APIs del backend en el frontend. Se recomienda seguir el orden de los sprints para tener resultados incrementales y funcionales en cada iteración.

**Próximo paso**: Comenzar con Sprint 1 (Fundamentos) implementando los tipos TypeScript y el cliente API.
