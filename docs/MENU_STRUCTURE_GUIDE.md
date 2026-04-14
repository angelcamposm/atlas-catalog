# 📋 Guía de Estructura de Menús - Atlas Catalog

## 🎯 Objetivo

Crear una navegación **superior a Backstage** que sea:

-   **Intuitiva**: Agrupación lógica por dominio funcional
-   **Escalable**: Preparada para crecer sin volverse caótica
-   **Orientada a tareas**: Los usuarios encuentran lo que buscan rápidamente
-   **Progresiva**: Muestra complejidad según el contexto

---

## 📊 Análisis de APIs Disponibles

### Inventario Completo de Endpoints

| Dominio            | Endpoint                  | Descripción                           | Prioridad UI |
| ------------------ | ------------------------- | ------------------------------------- | ------------ |
| **API Catalog**    | `/apis`                   | APIs del catálogo                     | ⭐⭐⭐ Alta  |
|                    | `/apis/types`             | Tipos de API (REST, GraphQL, gRPC...) | ⭐⭐ Media   |
|                    | `/apis/categories`        | Categorías de APIs                    | ⭐⭐ Media   |
|                    | `/apis/statuses`          | Estados de APIs                       | ⭐ Config    |
|                    | `/apis/access-policies`   | Políticas de acceso                   | ⭐⭐ Media   |
| **Business**       | `/business-domains`       | Dominios de negocio                   | ⭐⭐⭐ Alta  |
|                    | `/business-tiers`         | Niveles de criticidad                 | ⭐⭐ Media   |
|                    | `/environments`           | Entornos (dev, staging, prod)         | ⭐⭐⭐ Alta  |
|                    | `/lifecycles`             | Estados del ciclo de vida             | ⭐⭐ Media   |
| **Infrastructure** | `/clusters`               | Clusters K8s                          | ⭐⭐⭐ Alta  |
|                    | `/clusters/types`         | Tipos de cluster                      | ⭐ Config    |
|                    | `/nodes`                  | Nodos de clusters                     | ⭐⭐ Media   |
|                    | `/platforms`              | Plataformas (AWS, Azure...)           | ⭐⭐⭐ Alta  |
|                    | `/infrastructure-types`   | Tipos de infra                        | ⭐ Config    |
| **Technology**     | `/vendors`                | Proveedores tecnológicos              | ⭐⭐ Media   |
|                    | `/frameworks`             | Frameworks de desarrollo              | ⭐⭐ Media   |
|                    | `/programming-languages`  | Lenguajes de programación             | ⭐⭐ Media   |
| **Resources**      | `/resources`              | Recursos genéricos (DBs, caches...)   | ⭐⭐⭐ Alta  |
|                    | `/resources/categories`   | Categorías de recursos                | ⭐ Config    |
| **Links**          | `/links`                  | Enlaces externos                      | ⭐⭐ Media   |
|                    | `/links/categories`       | Categorías de enlaces                 | ⭐ Config    |
| **Organization**   | `/groups`                 | Grupos/Equipos                        | ⭐⭐⭐ Alta  |
|                    | `/groups/types`           | Tipos de grupo (Team, Squad...)       | ⭐ Config    |
|                    | `/groups/member-roles`    | Roles de miembros                     | ⭐ Config    |
| **Security**       | `/authentication-methods` | Métodos de autenticación              | ⭐⭐ Media   |
|                    | `/service-accounts`       | Cuentas de servicio                   | ⭐⭐ Media   |
|                    | `/compliance-standards`   | Estándares de compliance              | ⭐⭐ Media   |
| **Operations**     | `/service-statuses`       | Estados operacionales                 | ⭐⭐ Media   |

---

## 🏗️ Estructura de Menús Propuesta

### Principios de Diseño (Mejoras sobre Backstage)

| Problema en Backstage   | Solución en Atlas                                   |
| ----------------------- | --------------------------------------------------- |
| Menú plano y largo      | **Agrupación jerárquica** con secciones colapsables |
| Todo mezclado           | **Dominios claros**: Catalog, Infra, Org, Config    |
| Sin búsqueda contextual | **Command Palette** (⌘K) con búsqueda global        |
| Configuración dispersa  | **Sección Admin** centralizada                      |
| Sin indicadores         | **Badges** con contadores y estados                 |

---

### 📌 Estructura de Navegación Principal

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 Search... (⌘K)                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 OVERVIEW                                                    │
│  ├── 🏠 Dashboard                    [Métricas generales]       │
│  └── 📈 Analytics                    [Tendencias y reportes]    │
│                                                                 │
│  📚 CATALOG                          [El corazón del portal]    │
│  ├── 🔌 APIs                    (24) [Catálogo principal]       │
│  ├── 🗄️ Resources               (12) [DBs, Caches, Queues...]   │
│  └── 🔗 Links                    (8) [Enlaces externos]         │
│                                                                 │
│  🏗️ INFRASTRUCTURE                   [Dónde se ejecuta]         │
│  ├── ☁️ Platforms                (3) [AWS, Azure, GCP...]       │
│  ├── 🎯 Clusters                 (5) [Clusters K8s]             │
│  ├── 💻 Nodes                   (15) [Nodos de clusters]        │
│  └── 🌍 Environments             (4) [dev, staging, prod...]    │
│                                                                 │
│  👥 ORGANIZATION                     [Quién es responsable]     │
│  ├── 🏢 Teams                    (8) [Equipos y ownership]      │
│  ├── 🤖 Service Accounts         (3) [Cuentas automatizadas]    │
│  └── 📋 Ownership Matrix             [Vista de responsables]    │
│                                                                 │
│  🏷️ TAXONOMY                         [Clasificación]            │
│  ├── 🎯 Business Domains        (12) [Dominios de negocio]      │
│  ├── ⭐ Business Tiers           (4) [Criticidad: T1-T4]        │
│  └── 🔄 Lifecycles               (5) [Estados del ciclo]        │
│                                                                 │
│  🔧 TECHNOLOGY                       [Stack tecnológico]        │
│  ├── 🏭 Vendors                 (11) [Proveedores]              │
│  ├── 📦 Frameworks              (20) [Spring, Next.js...]       │
│  └── 💻 Languages                (8) [Java, Python, TS...]      │
│                                                                 │
│  🔒 SECURITY                         [Seguridad y compliance]   │
│  ├── 🔐 Auth Methods             (5) [OAuth, API Key...]        │
│  ├── 📜 Access Policies          (3) [Políticas de acceso]      │
│  └── ✅ Compliance               (2) [SOC2, GDPR...]            │
│                                                                 │
│  ⚙️ ADMINISTRATION                   [Solo admins]              │
│  ├── 🏷️ API Types                    [REST, GraphQL, gRPC...]   │
│  ├── 📊 API Statuses                 [Active, Deprecated...]    │
│  ├── 🗂️ Categories                   [Gestión de categorías]    │
│  ├── 👤 Group Types                  [Team, Squad, Chapter...]  │
│  ├── 🎭 Member Roles                 [Owner, Member, Viewer...] │
│  └── ⚙️ Settings                     [Configuración general]    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  👤 John Doe                                                    │
│     john@example.com                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas del Frontend

### Mapeo Menú → Rutas → Carpetas

```
frontend/app/[locale]/(protected)/
│
├── dashboard/                    # 📊 OVERVIEW
│   └── page.tsx                 # Dashboard principal
│
├── analytics/
│   └── page.tsx                 # Reportes y tendencias
│
├── apis/                        # 📚 CATALOG - APIs
│   ├── page.tsx                 # Lista de APIs
│   ├── [id]/                    # Detalle de API
│   │   ├── page.tsx            # Overview
│   │   ├── docs/               # Documentación/Swagger
│   │   ├── dependencies/       # Dependencias
│   │   └── deployments/        # Despliegues
│   └── new/
│       └── page.tsx            # Crear nueva API
│
├── resources/                   # 📚 CATALOG - Resources
│   ├── page.tsx
│   ├── [id]/
│   │   └── page.tsx
│   └── categories/             # Subcategorías
│       └── page.tsx
│
├── links/                       # 📚 CATALOG - Links
│   ├── page.tsx
│   └── categories/
│       └── page.tsx
│
├── infrastructure/              # 🏗️ INFRASTRUCTURE
│   ├── platforms/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── clusters/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── nodes/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── environments/
│       ├── page.tsx
│       └── [id]/page.tsx
│
├── organization/                # 👥 ORGANIZATION
│   ├── teams/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── service-accounts/
│   │   └── page.tsx
│   └── ownership/
│       └── page.tsx            # Matriz de ownership
│
├── taxonomy/                    # 🏷️ TAXONOMY
│   ├── business-domains/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── business-tiers/
│   │   └── page.tsx
│   └── lifecycles/
│       └── page.tsx
│
├── technology/                  # 🔧 TECHNOLOGY
│   ├── vendors/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── frameworks/
│   │   └── page.tsx
│   └── languages/
│       └── page.tsx
│
├── security/                    # 🔒 SECURITY
│   ├── auth-methods/
│   │   └── page.tsx
│   ├── access-policies/
│   │   └── page.tsx
│   └── compliance/
│       └── page.tsx
│
└── admin/                       # ⚙️ ADMINISTRATION
    ├── api-types/
    │   └── page.tsx
    ├── api-statuses/
    │   └── page.tsx
    ├── api-categories/
    │   └── page.tsx
    ├── group-types/
    │   └── page.tsx
    ├── member-roles/
    │   └── page.tsx
    ├── resource-categories/
    │   └── page.tsx
    ├── link-categories/
    │   └── page.tsx
    ├── cluster-types/
    │   └── page.tsx
    └── settings/
        └── page.tsx
```

---

## 🎨 Patrones de Pantalla

### 1. Pantalla de Lista (Index)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔌 APIs                                          [+ Create API] │
│ Manage your API catalog                                         │
├─────────────────────────────────────────────────────────────────┤
│ 🔍 Search APIs...    [Type ▼] [Status ▼] [Domain ▼] [Team ▼]   │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ Payment API     │ │ Users API       │ │ Orders API      │    │
│ │ REST • v2.3.1   │ │ GraphQL • v1.0  │ │ gRPC • v3.0     │    │
│ │ 🟢 Active       │ │ 🟡 Beta         │ │ 🔴 Deprecated   │    │
│ │ Team: Platform  │ │ Team: Identity  │ │ Team: Commerce  │    │
│ │ Domain: Payments│ │ Domain: Users   │ │ Domain: Orders  │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│                                                                 │
│ Showing 1-12 of 24 APIs                      [◀ 1 2 3 ... ▶]   │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Pantalla de Detalle (Show)

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to APIs                                                  │
│                                                                 │
│ 🔌 Payment Gateway API                      [Edit] [⋮ More]     │
│ REST API for payment processing                                 │
│ v2.3.1 • 🟢 Active • Team: Platform                            │
├─────────────────────────────────────────────────────────────────┤
│ [Overview] [API Docs] [Dependencies] [Deployments] [Activity]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ 📋 About        │ │ 🔗 Relations    │ │ 🌐 Links        │    │
│ │ ────────────────│ │ ────────────────│ │ ────────────────│    │
│ │ Type: REST      │ │ Uses:           │ │ 📄 Docs         │    │
│ │ Domain: Payments│ │  → PostgreSQL   │ │ 🔗 Repository   │    │
│ │ Tier: T1        │ │  → Redis Cache  │ │ 📊 Dashboard    │    │
│ │ Lifecycle: Prod │ │                 │ │ 🎫 Jira Board   │    │
│ │ Auth: OAuth2    │ │ Used by:        │ │                 │    │
│ │                 │ │  ← Mobile App   │ │                 │    │
│ │ Owner: @jdoe    │ │  ← Web Portal   │ │                 │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 📖 Description                                              │ │
│ │ ──────────────────────────────────────────────────────────  │ │
│ │ This API handles all payment processing for the platform.   │ │
│ │ It supports credit cards, PayPal, and bank transfers.       │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Pantalla de Configuración (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚙️ API Types                                    [+ Add Type]    │
│ Configure the types of APIs in your catalog                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Name          │ Description                  │ APIs │ Actions│ │
│ ├───────────────┼──────────────────────────────┼──────┼────────│ │
│ │ REST          │ RESTful HTTP APIs            │  15  │ ✏️ 🗑️ │ │
│ │ GraphQL       │ GraphQL APIs                 │   5  │ ✏️ 🗑️ │ │
│ │ gRPC          │ gRPC Protocol Buffers        │   3  │ ✏️ 🗑️ │ │
│ │ WebSocket     │ Real-time WebSocket APIs     │   1  │ ✏️ 🗑️ │ │
│ │ SOAP          │ Legacy SOAP Services         │   0  │ ✏️ 🗑️ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos de Navegación

### Flujo Principal: Descubrir una API

```
Dashboard → APIs (lista) → API Detail → API Docs (Swagger)
                                     → Dependencies (grafo)
                                     → Deployments (por entorno)
```

### Flujo de Ownership

```
Teams (lista) → Team Detail → APIs owned by team
                           → Resources owned by team
                           → Members
```

### Flujo de Infraestructura

```
Platforms → Platform Detail → Clusters in platform
                           → Environments

Clusters → Cluster Detail → Nodes
                         → APIs deployed
                         → Resources deployed
```

---

## 🏷️ Sistema de Badges

| Badge        | Color                | Uso                     |
| ------------ | -------------------- | ----------------------- |
| Número       | `info` (azul)        | Contadores de elementos |
| `Active`     | `success` (verde)    | Estado activo/saludable |
| `Beta`       | `warning` (amarillo) | En desarrollo/beta      |
| `Deprecated` | `danger` (rojo)      | Deprecado/problemas     |
| `New`        | `info` (azul)        | Elementos recientes     |
| `T1`         | `danger` (rojo)      | Tier 1 (crítico)        |
| `T2`         | `warning` (amarillo) | Tier 2 (importante)     |
| `T3`         | `info` (azul)        | Tier 3 (normal)         |

---

## 📱 Responsividad

### Desktop (>1024px)

-   Sidebar fijo expandido (240px)
-   Contenido principal con cards en grid

### Tablet (768px - 1024px)

-   Sidebar colapsable con toggle
-   Grid de 2 columnas

### Mobile (<768px)

-   Sidebar como drawer (hamburger menu)
-   Grid de 1 columna
-   Bottom navigation opcional

---

## 🎯 Prioridades de Implementación

### Fase 1: Core Catalog (MVP)

1. ✅ Dashboard
2. 🔄 APIs (lista + detalle + crear)
3. 🔄 Teams
4. ⬜ Business Domains

### Fase 2: Infrastructure

5. ⬜ Platforms
6. ⬜ Clusters
7. ⬜ Environments
8. ⬜ Nodes

### Fase 3: Extended Catalog

9. ⬜ Resources
10. ⬜ Links
11. ⬜ Lifecycles

### Fase 4: Technology & Security

12. ⬜ Vendors
13. ⬜ Frameworks
14. ⬜ Auth Methods
15. ⬜ Compliance

### Fase 5: Administration

16. ⬜ Todos los tipos/categorías
17. ⬜ Settings
18. ⬜ Audit Log

---

## 📝 Checklist de Implementación por Pantalla

Para cada entidad, implementar:

-   [ ] **Lista** (`/entities/page.tsx`)

    -   [ ] Tabla/Grid de elementos
    -   [ ] Filtros y búsqueda
    -   [ ] Paginación
    -   [ ] Botón crear
    -   [ ] Empty state

-   [ ] **Detalle** (`/entities/[id]/page.tsx`)

    -   [ ] Header con acciones
    -   [ ] Tabs de información
    -   [ ] Cards de metadata
    -   [ ] Relaciones

-   [ ] **Crear/Editar** (`/entities/new/page.tsx` o modal)

    -   [ ] Formulario
    -   [ ] Validación
    -   [ ] Feedback de éxito/error

-   [ ] **API Integration** (`/lib/api/entities.ts`)
    -   [ ] getAll
    -   [ ] getById
    -   [ ] create
    -   [ ] update
    -   [ ] delete

---

## 🔗 Referencias

-   [Backstage](https://backstage.io/docs/features/software-catalog/)
-   [Port.io](https://docs.getport.io/)
-   [Cortex](https://www.cortex.io/)
-   [OpsLevel](https://www.opslevel.com/)
