# Frontend Backlog – Atlas Catalog

Este documento recoge el backlog de tareas de frontend para consumir las APIs expuestas por el backend de Atlas Catalog.

## Principios

-   Cada recurso REST del backend tendrá al menos:
    -   Tipos Zod y TypeScript en `types/api.ts`.
    -   Cliente en `lib/api/<recurso>.ts`.
    -   Página de listado en `app/[locale]/(protected)/<recurso>/page.tsx`.
    -   Tests mínimos (unitarios para esquemas/clients y, si procede, tests de página).
-   Los formularios de creación/edición se planificarán después, una vez consolidados los listados.

---

## API Domain

### APIs – `/apis`

-   [ ] Revisar y consolidar `apiSchema` y `apisApi`.
-   [ ] Mejorar página de listado `app/[locale]/(protected)/apis/page.tsx`:
    -   Filtros (por tipo, estado, protocolo, etc.).
    -   Búsqueda por nombre / URL.
    -   Paginación completa y accesible.
-   [ ] Crear página de detalle de API:
    -   Ruta: `app/[locale]/(protected)/apis/[id]/page.tsx`.
    -   Datos adicionales: especificación de documento, políticas de acceso relacionadas, etc.
-   [ ] (Futuro) Formularios de creación/edición de API.

### API Access Policies – `/apis/access-policies`

-   [ ] Definir/validar esquema Zod y tipos TS para `ApiAccessPolicy` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/api-access-policies.ts`:
    -   `getAll`, `getById`, `create`, `update`, `delete`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/apis/access-policies/page.tsx`.
-   [ ] (Opcional) Página de detalle:
    -   `app/[locale]/(protected)/apis/access-policies/[id]/page.tsx`.
-   [ ] Componentes UI reutilizables de tabla/lista para políticas de acceso.

### API Categories – `/apis/categories`

-   [ ] Definir/validar esquema y tipos TS para `ApiCategory`.
-   [ ] Crear cliente `lib/api/api-categories.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/apis/categories/page.tsx`.
-   [ ] (Opcional) Detalle `[id]` y formulario simple de creación/edición.

### API Statuses – `/apis/statuses`

-   [ ] Revisar esquema/tipos `ApiStatus` en `types/api.ts` y alinearlos con el backend.
-   [ ] Crear cliente `lib/api/api-statuses.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/apis/statuses/page.tsx`.
-   [ ] Integrar estados de API como filtros y badges en la UI de APIs.

### API Types – `/apis/types`

-   [ ] Revisar esquema/tipos `ApiType` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/api-types.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/apis/types/page.tsx`.
-   [ ] Integrar tipos de API en filtros y metadatos de APIs.

---

## Business Domain

### Business Domains – `/business-domains`

-   [ ] Validar esquema Zod/TS `BusinessDomain` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/business-domains.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/business-domains/page.tsx`.
-   [ ] (Opcional) Página de detalle sencilla.

### Business Tiers – `/business-tiers`

-   [ ] Validar esquema/tipos `BusinessTier` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/business-tiers.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/business-tiers/page.tsx`.

### Environments – `/environments`

-   [ ] Validar esquema/tipos `Environment` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/environments.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/environments/page.tsx`.

### Lifecycles – `/lifecycles`

-   [ ] Asegurar esquema/tipos `Lifecycle` (ya existe) alineado con backend.
-   [ ] Crear cliente `lib/api/lifecycles.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/lifecycles/page.tsx`.

---

## Compliance Domain

### Compliance Standards – `/compliance-standards`

-   [ ] Añadir esquema Zod/TS `ComplianceStandard` en `types/api.ts` si no existe.
-   [ ] Crear cliente `lib/api/compliance-standards.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/compliance-standards/page.tsx`.

---

## Link Domain

### Link Categories – `/links/categories`

-   [ ] Definir esquema/tipos `LinkCategory`.
-   [ ] Crear cliente `lib/api/link-categories.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/links/categories/page.tsx`.

### Links – `/links`

-   [ ] Definir esquema/tipos `Link`.
-   [ ] Crear cliente `lib/api/links.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/links/page.tsx`.

---

## Operation Domain

### Service Statuses – `/service-statuses`

-   [ ] Revisar esquema/tipos `ServiceStatus` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/service-statuses.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/service-statuses/page.tsx`.

---

## Resource Domain

### Resource Categories – `/resources/categories`

-   [ ] Definir esquema/tipos `ResourceCategory`.
-   [ ] Crear cliente `lib/api/resource-categories.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/resources/categories/page.tsx`.

### Resources – `/resources`

-   [ ] Definir esquema/tipos `Resource`.
-   [ ] Crear cliente `lib/api/resources.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/resources/page.tsx`.

---

## Security Domain

### Authentication Methods – `/authentication-methods`

-   [ ] Definir esquema/tipos `AuthenticationMethod`.
-   [ ] Crear cliente `lib/api/authentication-methods.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/authentication-methods/page.tsx`.

### Service Accounts – `/service-accounts`

-   [ ] Definir esquema/tipos `ServiceAccount`.
-   [ ] Crear cliente `lib/api/service-accounts.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/service-accounts/page.tsx`.

---

## Technology Domain

### Cluster Types – `/clusters/types`

-   [ ] Definir esquema/tipos `ClusterType`.
-   [ ] Crear cliente `lib/api/cluster-types.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/clusters/types/page.tsx`.

### Clusters – `/clusters`

-   [ ] Definir esquema/tipos `Cluster`.
-   [ ] Crear cliente `lib/api/clusters.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/clusters/page.tsx`.

### Frameworks – `/frameworks`

-   [ ] Revisar esquema/tipos `Framework` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/frameworks.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/frameworks/page.tsx`.

### Infrastructure Types – `/infrastructure-types`

-   [ ] Definir esquema/tipos `InfrastructureType`.
-   [ ] Crear cliente `lib/api/infrastructure-types.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/infrastructure-types/page.tsx`.

### Nodes – `/nodes`

-   [ ] Definir esquema/tipos `Node`.
-   [ ] Crear cliente `lib/api/nodes.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/nodes/page.tsx`.

### Platforms – `/platforms`

-   [ ] Revisar esquema/tipos `Platform` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/platforms.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/platforms/page.tsx`.

### Programming Languages – `/programming-languages`

-   [ ] Usar esquema/tipos `ProgrammingLanguage` ya definidos.
-   [ ] Crear cliente `lib/api/programming-languages.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/programming-languages/page.tsx`.

### Vendors – `/vendors`

-   [ ] Definir esquema/tipos `Vendor`.
-   [ ] Crear cliente `lib/api/vendors.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/vendors/page.tsx`.

---

## Account Domain

### Groups – `/groups`

-   [ ] Usar esquema/tipos `Group` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/groups.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/groups/page.tsx`.

### Group Types – `/groups/types`

-   [ ] Definir esquema/tipos `GroupType` (si aplica).
-   [ ] Crear cliente `lib/api/group-types.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/groups/types/page.tsx`.

### Group Member Roles – `/groups/member-roles`

-   [ ] Usar esquema/tipos `GroupMemberRole` en `types/api.ts`.
-   [ ] Crear cliente `lib/api/group-member-roles.ts`.
-   [ ] Crear página de listado:
    -   `app/[locale]/(protected)/groups/member-roles/page.tsx`.

---

## UI Components – Paneles y Detalle de Componentes

Estos trabajos se centran en definir/generar componentes reutilizables de UI para representar "componentes" del catálogo (similar a la captura de Compass), aprovechando al máximo las librerías y componentes existentes, e incorporando terceros cuando mejoren la UX/UI.

### Layout base de página de componente

-   [ ] Diseñar `ComponentPageLayout` como layout base:
    -   Columna principal (contenido de panel, métricas, actividad).
    -   Panel lateral derecho (detalles: equipos, repos, proyectos, enlaces, etc.).
    -   Soporte responsive (stack en móvil, dos columnas en desktop).
-   [ ] Integrar correctamente con el selector de temas existente (usar tokens y utilidades Tailwind ya definidas, `dark:` donde aplique).

### Cabecera del componente

-   [ ] Crear `ComponentHeader` con:
    -   Título del componente.
    -   Estado (badge: Activo/Inactivo, etc.).
    -   Nivel/criticidad (pill/label).
    -   Acciones (iconos para favoritos, menú de opciones, etc.).
-   [ ] Evaluar uso de componentes existentes (por ejemplo `PageHeader`, `Badge`, iconos de `react-icons`) y sólo crear lo mínimo necesario.

### Sidebar de detalles (panel derecho)

-   [ ] Crear `ComponentDetailsSidebar` con secciones configurables:
    -   Equipo propietario (avatares/lista; reutilizar componentes de avatar si existen o usar librería externa).
    -   Canales de chat.
    -   Repositorios.
    -   Proyectos.
    -   Paneles relacionados.
    -   Otros enlaces relevantes.
-   [ ] Definir subcomponentes reutilizables: `OwnerTeamsCard`, `ChatChannelsCard`, `RepositoriesCard`, `ProjectsCard`, `PanelsCard`, `LinksCard`, etc.
-   [ ] Mantener la apariencia coherente con el design system y el selector de temas.

### Descripción y etiquetas

-   [ ] Crear `ComponentDescription` para mostrar la descripción larga del componente.
-   [ ] Crear/ajustar `TagList` reutilizable (posiblemente sobre `Badge`) para etiquetas como `analytics`, `frontend`, etc.

### Navegación lateral de secciones

-   [ ] Crear `ComponentSectionNav` (lista vertical de secciones tipo "Descripción general", "Documentación", "Cuadros de mando", "Dependencias", "Métricas", etc.).
-   [ ] Diseñar estados de selección/hover coherentes con el resto de navegación; reutilizar componentes de menú/lista existentes si los hay.

### Barra de filtros de actividad

-   [ ] Crear `ActivityFiltersBar` con:
    -   Select de tipo de evento (Events, Deploys, etc.).
    -   Select de entorno (Producción, Staging, ...).
    -   Selector de rango temporal (Hora/Día/Semana) o similar.
-   [ ] Reutilizar componentes de `Select`/`Dropdown` existentes o introducir una librería de terceros si mejora la UX.

### Widgets de información / métricas

-   [x] Crear `MetricWidget` genérico:
    -   Título, valor principal, subtítulo, descripción, icono opcional.
    -   Variantes de tamaño (small/medium) y estilos (estado correcto/alerta, etc.).
-   [x] Crear contenedor `MetricsGrid` para organizar widgets en cuadrícula responsive.
-   [ ] Valorar uso de componentes de tarjeta ya existentes (`Card`, `CardHeader`, `CardContent`) para construir estos widgets.

### Timeline / actividad

-   [x] Crear `ActivityTimeline` o componente similar para mostrar una línea temporal de eventos (inicialmente puede usar datos mock o representación simple).
-   [x] Diseñar la API del componente para que luego pueda recibir datos reales de actividad.

### Consola de salud (Events, readiness)

-   [x] Crear bloque de "Eventos" tipo calendario horario inspirado en Compass (`EventsGrid`) con datos mock.
-   [x] Crear tarjetas de readiness/resumen de salud (`ReadinessWidget`) para mostrar aprobados y elementos que requieren atención.

### Slots y extensibilidad

-   [ ] Definir slots/props en `ComponentPageLayout` para secciones especiales como:
    -   "Config-as-code".
    -   "Dependencias de paquetes".
    -   "Otras tarjetas contextuales según el tipo de componente".

### Theming y librerías de terceros

-   [ ] Verificar que todos los nuevos componentes utilizan clases y tokens de Tailwind alineados con el design system (`DESIGN_SYSTEM.md`) y responden correctamente al selector de tema (light/dark).
-   [ ] Evaluar, caso a caso, el uso de componentes de terceros (por ejemplo, librerías de gráficos, timelines o selects avanzados) cuando aporten mejoras claras de UX/UI.
-   [ ] Documentar en este backlog cualquier librería nueva introducida (nombre, propósito y lugar de uso).
