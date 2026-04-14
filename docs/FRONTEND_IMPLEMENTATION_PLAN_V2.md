# Plan de Implementación Frontend V2 - Atlas Catalog

## 🎯 Visión del Proyecto

Atlas Catalog es un **Portal de Desarrolladores Interno (IDP)** inspirado en:

-   **[Backstage](https://github.com/backstage/backstage)** - Portal de desarrolladores de Spotify
-   **[Port.io](https://www.port.io/)** - Plataforma de portal interno

El objetivo es crear una experiencia similar para gestionar APIs, servicios, infraestructura y documentación.

---

## 📐 Arquitectura de Pantallas

### Estructura de Navegación Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ATLAS CATALOG                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  🏠 Home                    │  Visión general del portal                │
│  📊 Dashboard               │  Métricas y estadísticas                  │
│  ────────────────────────── │ ─────────────────────────────────────────│
│  📚 CATÁLOGO                │                                           │
│  ├── APIs                   │  Catálogo de APIs                        │
│  ├── Services               │  Servicios y microservicios              │
│  ├── Resources              │  Recursos (DBs, Caches, etc.)            │
│  └── Documentation          │  Documentación técnica                   │
│  ────────────────────────── │ ─────────────────────────────────────────│
│  🏗️ INFRAESTRUCTURA         │                                           │
│  ├── Clusters               │  Clusters K8s                            │
│  ├── Nodes                  │  Nodos de clusters                       │
│  ├── Platforms              │  Plataformas tecnológicas                │
│  └── Environments           │  Entornos (dev, staging, prod)           │
│  ────────────────────────── │ ─────────────────────────────────────────│
│  🔗 INTEGRACIONES           │                                           │
│  ├── Links                  │  Enlaces entre servicios                 │
│  └── Dependencies           │  Mapa de dependencias                    │
│  ────────────────────────── │ ─────────────────────────────────────────│
│  👥 ORGANIZACIÓN            │                                           │
│  ├── Teams                  │  Equipos y ownership                     │
│  ├── Groups                 │  Grupos de usuarios                      │
│  └── Service Accounts       │  Cuentas de servicio                     │
│  ────────────────────────── │ ─────────────────────────────────────────│
│  ⚙️ ADMINISTRACIÓN          │                                           │
│  ├── Types & Taxonomies     │  Gestión de tipos                        │
│  ├── Compliance             │  Estándares de compliance                │
│  └── Settings               │  Configuración                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Componentes de UI Inspirados en Backstage/Port.io

### 1. Entity Cards (Tarjetas de Entidad)

Componentes tipo tarjeta para mostrar entidades del catálogo.

```
┌────────────────────────────────────────┐
│ 🔷 API Icon                            │
│ ──────────────────────────────────────│
│ Payment Gateway API          v2.3.1   │
│ ──────────────────────────────────────│
│ REST API for payment processing       │
│                                        │
│ 👤 Team: Platform           🟢 Active  │
│ 📁 Domain: Payments         ⭐ Tier 1  │
│ ──────────────────────────────────────│
│ [View] [Docs] [OpenAPI]               │
└────────────────────────────────────────┘
```

### 2. Service Overview Page (Página de Detalle)

Página de detalle tipo Backstage con tabs.

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back to Catalog                                                   │
│                                                                     │
│ 🔷 Payment Gateway API                              [Edit] [Delete] │
│ REST API for payment processing                                     │
│ ───────────────────────────────────────────────────────────────────│
│ [Overview] [API Docs] [Dependencies] [Deployments] [Metrics]       │
│ ───────────────────────────────────────────────────────────────────│
│                                                                     │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│ │ About           │  │ Relations       │  │ Links           │     │
│ │ ─────────────── │  │ ─────────────── │  │ ─────────────── │     │
│ │ Owner: Team X   │  │ → Uses: DB-01   │  │ 📄 Docs         │     │
│ │ Lifecycle: Prod │  │ → Uses: Redis   │  │ 🔗 Repository   │     │
│ │ Type: REST      │  │ ← UsedBy: App1  │  │ 📊 Dashboard    │     │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │ API Documentation (Swagger UI)                               │   │
│ │ ─────────────────────────────────────────────────────────── │   │
│ │ [Embedded OpenAPI Viewer]                                    │   │
│ └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3. Dependency Graph (Mapa de Dependencias)

Visualización tipo Port.io de relaciones.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DEPENDENCY MAP                                   │
│ ───────────────────────────────────────────────────────────────────│
│                                                                     │
│     ┌─────────┐         ┌─────────┐         ┌─────────┐           │
│     │ Web App │ ──────► │ API GW  │ ──────► │ Payment │           │
│     └─────────┘         └─────────┘         │   API   │           │
│                              │               └─────────┘           │
│                              ▼                    │                 │
│                         ┌─────────┐              │                 │
│                         │ Auth    │              ▼                 │
│                         │ Service │         ┌─────────┐           │
│                         └─────────┘         │ Postgres│           │
│                                             └─────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4. Scorecards (Tarjetas de Puntuación)

Métricas de madurez tipo Port.io.

```
┌─────────────────────────────────────────────────────────────────────┐
│ SERVICE SCORECARD                                    Score: 85/100  │
│ ───────────────────────────────────────────────────────────────────│
│                                                                     │
│ ✅ Has Documentation          ████████████████████ 100%            │
│ ✅ Has OpenAPI Spec           ████████████████████ 100%            │
│ ⚠️  Has Monitoring            ██████████████░░░░░░  70%            │
│ ✅ Has Owner                  ████████████████████ 100%            │
│ ❌ Has Runbooks               ░░░░░░░░░░░░░░░░░░░░   0%            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Fases de Implementación Detalladas

### FASE 1: Foundation & Core UI ⭐ (Prioridad Crítica)

**Objetivo**: Establecer los componentes base y patrones de diseño

#### 1.1 Sistema de Diseño

-   [ ] Componentes de Card reutilizables
-   [ ] Sistema de Badges/Tags consistente
-   [ ] Componentes de Stats/Metrics
-   [ ] Empty states con ilustraciones
-   [ ] Loading skeletons
-   [ ] Error boundaries con diseño amigable

#### 1.2 Layout y Navegación

-   [ ] Sidebar mejorado con secciones colapsables
-   [ ] Breadcrumbs dinámicos
-   [ ] Command palette (Cmd+K) para búsqueda rápida
-   [ ] Header con búsqueda global
-   [ ] Footer con información del sistema

**Archivos a crear/modificar**:

```
frontend/components/
├── ui/
│   ├── EntityCard.tsx           # Tarjeta genérica de entidad
│   ├── StatCard.tsx             # Tarjeta de estadísticas
│   ├── ScoreCard.tsx            # Tarjeta de puntuación
│   ├── RelationshipBadge.tsx    # Badge de relaciones
│   ├── StatusIndicator.tsx      # Indicador de estado
│   └── EmptyState.tsx           # Estado vacío
├── layout/
│   ├── AppSidebar.tsx           # Sidebar mejorado (existente)
│   ├── Breadcrumbs.tsx          # Breadcrumbs dinámicos
│   ├── CommandPalette.tsx       # Búsqueda Cmd+K
│   └── GlobalSearch.tsx         # Búsqueda en header
```

**Tiempo estimado**: 12-16 horas

---

### FASE 2: Catálogo de APIs ⭐ (Prioridad Alta)

**Objetivo**: Experiencia completa de catálogo tipo Backstage

#### 2.1 Lista de APIs

-   [ ] Grid/List view toggle
-   [ ] Filtros avanzados (tipo, estado, lifecycle, owner)
-   [ ] Búsqueda con highlighting
-   [ ] Ordenación múltiple
-   [ ] Paginación mejorada
-   [ ] Export a CSV/JSON

#### 2.2 Detalle de API (Entity Page)

-   [ ] Header con info principal
-   [ ] Tabs: Overview, API Docs, Dependencies, History
-   [ ] Panel lateral con metadata
-   [ ] Swagger UI embebido
-   [ ] Sección de relaciones
-   [ ] Links externos

#### 2.3 Formularios CRUD

-   [ ] Wizard de creación multi-paso
-   [ ] Formulario de edición
-   [ ] Confirmación de eliminación
-   [ ] Validación en tiempo real

**Estructura de páginas**:

```
frontend/app/[locale]/(protected)/
├── apis/
│   ├── page.tsx                 # Lista con filtros
│   ├── [id]/
│   │   ├── page.tsx             # Vista de detalle con tabs
│   │   ├── edit/
│   │   │   └── page.tsx         # Formulario de edición
│   │   └── docs/
│   │       └── page.tsx         # Swagger UI fullscreen
│   └── new/
│       └── page.tsx             # Wizard de creación
```

**Componentes específicos**:

```
frontend/components/apis/
├── ApiCard.tsx                  # Tarjeta de API
├── ApiList.tsx                  # Lista de APIs
├── ApiFilters.tsx               # Panel de filtros
├── ApiDetail/
│   ├── ApiHeader.tsx            # Header de detalle
│   ├── ApiOverview.tsx          # Tab Overview
│   ├── ApiDocs.tsx              # Tab con Swagger
│   ├── ApiDependencies.tsx      # Tab Dependencies
│   └── ApiMetadata.tsx          # Panel lateral
├── ApiForm/
│   ├── CreateApiWizard.tsx      # Wizard multi-paso
│   ├── EditApiForm.tsx          # Form de edición
│   └── ApiFormFields.tsx        # Campos compartidos
└── index.ts
```

**Tiempo estimado**: 20-24 horas

---

### FASE 3: Dashboard Principal ⭐ (Prioridad Alta)

**Objetivo**: Dashboard ejecutivo con insights

#### 3.1 Widgets de Estadísticas

-   [ ] Total APIs por estado
-   [ ] APIs por lifecycle
-   [ ] APIs por tipo
-   [ ] APIs por owner/team
-   [ ] Tendencia de creación

#### 3.2 Actividad Reciente

-   [ ] Timeline de cambios
-   [ ] APIs añadidas recientemente
-   [ ] APIs actualizadas

#### 3.3 Quick Actions

-   [ ] Crear nueva API
-   [ ] Buscar en catálogo
-   [ ] Ver documentación

#### 3.4 Health Overview

-   [ ] Estado de clusters
-   [ ] Servicios con problemas
-   [ ] Compliance status

**Estructura**:

```
frontend/app/[locale]/(protected)/dashboard/
└── page.tsx

frontend/components/dashboard/
├── DashboardLayout.tsx
├── widgets/
│   ├── ApiStatsWidget.tsx
│   ├── ApisByLifecycleChart.tsx
│   ├── ApisByTypeChart.tsx
│   ├── RecentActivityWidget.tsx
│   ├── QuickActionsWidget.tsx
│   ├── ClusterHealthWidget.tsx
│   └── ComplianceWidget.tsx
└── index.ts
```

**Tiempo estimado**: 16-20 horas

---

### FASE 4: Infraestructura (Prioridad Media)

**Objetivo**: Gestión de clusters, nodos y plataformas

#### 4.1 Clusters

-   [ ] Lista de clusters con estado
-   [ ] Detalle con nodos asociados
-   [ ] Métricas de capacidad
-   [ ] Formularios CRUD

#### 4.2 Nodes

-   [ ] Lista por cluster
-   [ ] Estado de recursos (CPU, Memory)
-   [ ] Filtros por tipo y rol

#### 4.3 Environments

-   [ ] Vista de matriz de entornos
-   [ ] APIs por entorno
-   [ ] Promoción entre entornos

**Tiempo estimado**: 12-16 horas

---

### FASE 5: Equipos y Ownership (Prioridad Media)

**Objetivo**: Gestión de equipos y propiedad de servicios

#### 5.1 Teams

-   [ ] Lista de equipos
-   [ ] Detalle con miembros
-   [ ] APIs owned
-   [ ] Métricas del equipo

#### 5.2 Groups

-   [ ] Estructura jerárquica
-   [ ] Permisos y roles

**Tiempo estimado**: 8-12 horas

---

### FASE 6: Taxonomías y Administración (Prioridad Media)

**Objetivo**: CRUD para tipos, estados, lifecycles, etc.

#### 6.1 Gestión de Tipos

-   [ ] API Types
-   [ ] API Statuses
-   [ ] API Categories
-   [ ] Lifecycles
-   [ ] Environments
-   [ ] Business Domains
-   [ ] Business Tiers

**Componente genérico reutilizable**:

```typescript
// TaxonomyManager - Componente genérico para CRUD de taxonomías
<TaxonomyManager
  title="API Types"
  endpoint={apiTypesApi}
  columns={['name', 'description']}
  createFields={[...]}
  editFields={[...]}
/>
```

**Tiempo estimado**: 10-14 horas

---

### FASE 7: Integraciones y Dependencias (Prioridad Baja)

**Objetivo**: Visualización de relaciones entre servicios

#### 7.1 Links

-   [ ] Lista de enlaces
-   [ ] CRUD de enlaces

#### 7.2 Dependency Graph

-   [ ] Visualización de grafo (react-flow o similar)
-   [ ] Filtros por tipo de relación
-   [ ] Drill-down a entidades

**Tiempo estimado**: 12-16 horas

---

### FASE 8: Búsqueda Global (Prioridad Media)

**Objetivo**: Búsqueda unificada tipo Backstage

#### 8.1 Search

-   [ ] Command Palette (Cmd+K)
-   [ ] Búsqueda por tipo de entidad
-   [ ] Resultados agrupados
-   [ ] Historial de búsqueda
-   [ ] Sugerencias

**Tiempo estimado**: 8-10 horas

---

## 📊 Resumen de Estimaciones

| Fase      | Descripción          | Prioridad  | Horas Est.  |
| --------- | -------------------- | ---------- | ----------- |
| 1         | Foundation & Core UI | ⭐ Crítica | 12-16h      |
| 2         | Catálogo de APIs     | ⭐ Alta    | 20-24h      |
| 3         | Dashboard Principal  | ⭐ Alta    | 16-20h      |
| 4         | Infraestructura      | Media      | 12-16h      |
| 5         | Equipos y Ownership  | Media      | 8-12h       |
| 6         | Taxonomías           | Media      | 10-14h      |
| 7         | Integraciones        | Baja       | 12-16h      |
| 8         | Búsqueda Global      | Media      | 8-10h       |
| **TOTAL** |                      |            | **98-128h** |

---

## 🚀 Roadmap de Sprints

### Sprint 1: Foundation (Semana 1-2)

-   ✅ Fase 1.1: Sistema de Diseño
-   ✅ Fase 1.2: Layout y Navegación
-   🔄 Fase 2.1: Lista de APIs (parcial)

### Sprint 2: API Catalog Core (Semana 3-4)

-   🔄 Fase 2.1: Lista de APIs (completar)
-   🔄 Fase 2.2: Detalle de API
-   🔄 Fase 2.3: Formularios CRUD

### Sprint 3: Dashboard & Insights (Semana 5-6)

-   🔄 Fase 3: Dashboard completo
-   🔄 Fase 8: Búsqueda Global

### Sprint 4: Infrastructure & Teams (Semana 7-8)

-   🔄 Fase 4: Infraestructura
-   🔄 Fase 5: Equipos

### Sprint 5: Admin & Polish (Semana 9-10)

-   🔄 Fase 6: Taxonomías
-   🔄 Fase 7: Integraciones
-   🔄 Testing y pulido

---

## 🎨 Guía de Estilo Visual

### Colores por Dominio

| Dominio        | Color Principal | Uso                |
| -------------- | --------------- | ------------------ |
| APIs           | `blue-500`      | Iconos, badges     |
| Infrastructure | `cyan-500`      | Clusters, nodes    |
| Platform       | `purple-500`    | Plataformas        |
| Teams          | `amber-500`     | Equipos, ownership |
| Security       | `red-500`       | Auth, tokens       |
| Business       | `green-500`     | Domains, tiers     |

### Estados

| Estado     | Color    | Badge                           |
| ---------- | -------- | ------------------------------- |
| Active     | `green`  | `bg-green-100 text-green-800`   |
| Deprecated | `yellow` | `bg-yellow-100 text-yellow-800` |
| Retired    | `red`    | `bg-red-100 text-red-800`       |
| Draft      | `gray`   | `bg-gray-100 text-gray-800`     |

### Iconos (react-icons/hi2)

| Entidad     | Icono            |
| ----------- | ---------------- |
| API         | `HiCodeBracket`  |
| Cluster     | `HiServerStack`  |
| Node        | `HiServer`       |
| Team        | `HiUserGroup`    |
| Environment | `HiGlobeAlt`     |
| Link        | `HiLink`         |
| Document    | `HiDocumentText` |
| Settings    | `HiCog6Tooth`    |

---

## 📁 Estructura Final de Archivos

```
frontend/
├── app/
│   └── [locale]/
│       └── (protected)/
│           ├── dashboard/
│           │   └── page.tsx
│           ├── apis/
│           │   ├── page.tsx
│           │   ├── new/
│           │   │   └── page.tsx
│           │   └── [id]/
│           │       ├── page.tsx
│           │       └── edit/
│           │           └── page.tsx
│           ├── infrastructure/
│           │   ├── page.tsx
│           │   ├── clusters/
│           │   ├── nodes/
│           │   └── environments/
│           ├── platform/
│           │   ├── page.tsx
│           │   └── platforms/
│           ├── integration/
│           │   ├── page.tsx
│           │   └── links/
│           ├── teams/
│           │   ├── page.tsx
│           │   └── [id]/
│           ├── admin/
│           │   ├── types/
│           │   ├── statuses/
│           │   ├── lifecycles/
│           │   ├── domains/
│           │   └── compliance/
│           └── settings/
├── components/
│   ├── ui/                      # Componentes base
│   ├── layout/                  # Layout components
│   ├── dashboard/               # Dashboard widgets
│   ├── apis/                    # API-specific
│   ├── infrastructure/          # Infra components
│   ├── platform/                # Platform components
│   ├── integration/             # Integration components
│   ├── teams/                   # Team components
│   └── admin/                   # Admin/taxonomy components
├── lib/
│   ├── api/                     # API modules
│   └── utils/                   # Utilities
├── hooks/                       # Custom hooks
├── types/                       # TypeScript types
└── messages/                    # i18n translations
```

---

## ✅ Checklist de Implementación

### Fase 1: Foundation

-   [ ] EntityCard component
-   [ ] StatCard component
-   [ ] StatusIndicator component
-   [ ] EmptyState component
-   [ ] Breadcrumbs component
-   [ ] CommandPalette component
-   [ ] Updated AppSidebar

### Fase 2: API Catalog

-   [ ] ApiCard component
-   [ ] ApiList with filters
-   [ ] ApiFilters component
-   [ ] Api detail page with tabs
-   [ ] ApiOverview tab
-   [ ] ApiDocs tab (Swagger)
-   [ ] CreateApiWizard
-   [ ] EditApiForm

### Fase 3: Dashboard

-   [ ] ApiStatsWidget
-   [ ] ApisByLifecycleChart
-   [ ] RecentActivityWidget
-   [ ] QuickActionsWidget
-   [ ] ClusterHealthWidget

### Fase 4-8: Remaining

-   [ ] Infrastructure pages
-   [ ] Teams pages
-   [ ] Taxonomy admin pages
-   [ ] Integration/Dependencies
-   [ ] Global search

---

## 📚 Referencias

-   [Backstage Documentation](https://backstage.io/docs)
-   [Port.io Docs](https://docs.getport.io/)
-   [Next.js App Router](https://nextjs.org/docs/app)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [React Icons](https://react-icons.github.io/react-icons/)
-   [Swagger UI React](https://github.com/swagger-api/swagger-ui)

---

## 💡 Notas de Implementación

1. **Reutilización**: Crear componentes genéricos que puedan usarse para diferentes tipos de entidades
2. **Consistencia**: Mantener patrones visuales similares a Backstage
3. **Responsive**: Diseño mobile-first
4. **Accesibilidad**: ARIA labels, keyboard navigation
5. **Performance**: Lazy loading, pagination, caching
6. **i18n**: Todas las cadenas traducibles
