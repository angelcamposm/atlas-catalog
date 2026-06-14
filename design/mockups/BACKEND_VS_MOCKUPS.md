# Backend ↔ Mockups · Mapeo de referencia

> **Regla de oro**: el backend es el contrato. El mockup solo muestra campos que la API
> devuelve (`Resource`), acepta (`StoreXxxRequest`) o enuncia en enums (`App\Enums\*`).
> Si un dato no está en ninguno de esos tres sitios, **no se inventa** en el mockup.

Este doc es la fuente de verdad. Cuando rehagas una pantalla, parte de aquí. Si un campo
cambia en el backend (migración nueva, enum nuevo), actualiza primero este doc y luego la
pantalla.

## Cómo leer

- **Campo**: nombre en la respuesta JSON (`snake_case`).
- **Tipo**: tipo Laravel (`string`, `integer`, `boolean`, `date`, `array`, `…Enum`).
- **Mockup (actual)**: cómo se muestra HOY en el HTML (puede ser correcto o inventado).
- **Acción**: lo que hay que hacer (`mantener` / `reemplazar` / `eliminar` / `añadir`).
- **Fuente**: `app/Http/Resources/*`, `app/Http/Requests/Store*Request`, `app/Models/*`, `app/Enums/*`.

---

## 1. Componentes (Components)

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/catalog/components` (+ `?page=N`, paginado 15)
**Recurso**: `App\Http\Resources\ComponentResource` (devuelve `parent::toArray($request)` = todo el modelo + timestamps)
**Form Request**: `StoreComponentRequest`, `UpdateComponentRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | max 255 |
| `slug` | string unique | – | añadir | auto-generado, mostrar en URL/KV |
| `display_name` | string | – | añadir | max 255 |
| `description` | text | ✓ | mantener | max 255 |
| `tags` | json/array | ✓ | mantener | chips |
| `domain_id` | FK business_domains | "System" (wrong) | reemplazar | "Business domain" |
| `tier_id` | FK business_tiers | "Tier (critical)" | mantener | mostrar `business_tier.name` |
| `lifecycle_id` | FK lifecycle_phases | "Production" | reemplazar | mostrar `lifecycle_phase.name` |
| `status_id` | FK service_statuses | – | añadir | Healthy/Degraded/… |
| `component_type_id` | FK component_types | "Type: service" | reemplazar | service/library/worker |
| `platform_id` | FK platforms | "Language" (wrong) | reemplazar | "Platform" |
| `owner_id` | FK groups | ✓ | mantener | mostrar grupo |
| `is_stateless` | bool | – | añadir | chip |
| `is_exposed` | bool | – | añadir | chip |
| `has_zero_downtime_deployments` | bool | – | añadir | chip |
| `end_of_life_at` | date | – | añadir | fecha |
| `discovery_source` | enum (Manual/Pipeline/Scan) | – | añadir | chip |
| `created_at`, `updated_at` | datetime | – | añadir | sección "Details" |

**Eliminar del mockup**: `Language: Go 1.24`, `Framework: chi + sqlc`, `Repository: gh/acme/payments`, `On-call: #payments-oncall`, la palabra "Tier 1 (critical)" como string libre (debe ser FK al `business_tier`).

**Relaciones (cargar con `?with=…` o `whenLoaded`)**:
- `apis` (m2m)
- `entities` (m2m)
- `systems` (m2m) ← el "system" del mockup es m2m
- `domain`, `tier`, `lifecyclePhases`, `platform`, `componentType`, `status`, `owner` (BelongsTo)

---

## 2. APIs

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/catalog/apis`
**Recurso**: `App\Http\Resources\ApiResource`
**Form Request**: `StoreApiRequest`, `UpdateApiRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | max 100 |
| `display_name` | string | – | añadir | max 255 |
| `description` | text | ✓ | mantener | max 255 |
| `url` | url | "Base URL" | mantener | max 255 |
| `version` | string | ✓ | mantener | max 50 |
| `protocol` | enum (Http/Https/WebSocket/Wss) | – | añadir | chip |
| `access_policy` | enum (Public/Internal/Partner/Composite) | "Internal" (label) | mantener | "Access policy" |
| `authentication_method_id` | FK auth_methods | "OAuth 2.0 + mTLS" | mantener | cargar nombre |
| `category_id` | FK categories | "Payments" | mantener | |
| `type_id` | FK api_types | "REST" | mantener | |
| `status_id` | FK api_statuses | "Active" | mantener | |
| `document_specification` | json | "Swagger / OpenAPI explorer" | mantener | usar como JSON en code-block |
| `released_at` | date | – | añadir | |
| `deprecated_at` | date | – | añadir | si no null, mostrar "Deprecated" |
| `deprecation_reason` | string | – | añadir | si deprecated |

---

## 3. Systems

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/architecture/systems` (+ `?with=components` para componentes)
**Recurso**: `App\Http\Resources\SystemResource`
**Form Request**: `StoreSystemRequest`, `UpdateSystemRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | max 50 |
| `display_name` | string | – | añadir | max 50 |
| `description` | text | ✓ | mantener | max 255 |
| `owner_id` | FK groups | ✓ | mantener | |
| `tags` | string | – | añadir | chips |
| `slug` | auto | – | añadir | (no en fillable; viene del accessor) |

**Eliminar del mockup**: `Business domain`, `Tier`, `Architecture` (Monolith/Microservices), `Criticality`, `Lifecycle`, columna "Components" y "APIs" en la lista (no son atributos directos).

**Relaciones**:
- `components()` (m2m) → para obtener componentes del sistema
- `businessCapabilities()` (m2m) → capabilities que soporta
- `owner()` (BelongsTo)

---

## 4. Clusters

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/infrastructure/clusters` (+ `?with=type,nodes`)
**Recurso**: `App\Http\Resources\ClusterResource`
**Form Request**: `StoreClusterRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | max 50 |
| `display_name` | string | – | añadir | |
| `description` | text | "EKS · K8s 1.31 · Ireland" | reemplazar | mover a campos separados |
| `cluster_uuid` | string | – | añadir | |
| `version` | string | – | añadir | "1.31" |
| `full_version` | string | – | añadir | "1.31.4" |
| `api_url` | url | "API server URL" | mantener | |
| `url` | url | – | añadir | (consola) |
| `type_id` | FK cluster_types | "EKS" | mantener | |
| `infrastructure_type_id` | FK infrastructure_types | – | añadir | cloud/on-prem |
| `lifecycle_id` | FK lifecycle_phases | – | añadir | |
| `has_licensing` | bool | – | añadir | |
| `licensing_model` | enum (None/OpenShift) | – | añadir | si `has_licensing` |
| `timezone` | string | – | añadir | |
| `tags` | json | – | añadir | |

**Eliminar del mockup**: columna "Nodes", "Pods", "CPU", "Memory" (no son atributos del cluster — el cluster no los calcula). Sección "EKS · Kubernetes 1.31 · Ireland" (separar en `version` + `timezone`/`description`).

**Relaciones**:
- `type()`, `infrastructureType()`, `lifecycle()` (BelongsTo)
- `nodes()` (m2m) → `/clusters/{id}/nodes`
- `serviceAccounts()` (m2m) → `/clusters/{id}/service-accounts`

---

## 5. Nodes

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/infrastructure/nodes` (+ `?with=cluster`)
**Recurso**: `App\Http\Resources\NodeResource`
**Form Request**: `StoreNodeRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | "ip-10-0-12-47.eu-west-1" | mantener | max 253 |
| `hostname` | string | – | añadir | |
| `fqdn` | string | – | añadir | |
| `ip_address` | ip | – | añadir | |
| `mac_address` | mac | – | añadir | |
| `node_type` | enum (H=Hybrid, P=Physical, U=Unknown, V=Virtual) | "Role: worker" | reemplazar | el mockup llama "role" lo que es `NodeRole` (master/infra/storage/worker) — pero `node_type` es lo que pide la API. Hay un enum `NodeRole` también pero el modelo no lo usa. Decisión: usar `node_type`. |
| `cpu_architecture` | enum (ARM/ARM64/X86-64) | – | añadir | |
| `cpu_sockets` | int | "vCPU" | reemplazar | nº de sockets físicos |
| `cpu_cores` | int | "vCPU" | reemplazar | cores por socket |
| `cpu_threads` | int | – | añadir | threads totales |
| `smt_enabled` | bool | – | añadir | |
| `memory_bytes` | bigint | "Memory" | reemplazar | en bytes (convertir a GiB en UI) |
| `os` | string | – | añadir | |
| `os_version` | string | – | añadir | |
| `timezone` | string | – | añadir | |
| `discovery_source` | enum (Manual/Pipeline/Scan) | – | añadir | |

**Eliminar del mockup**: `Instance type` (m5.2xlarge), `Max pods`, `Taints`, `Zone`, columna "Pods" (nº de pods que corren no es atributo del node en este modelo), `Role: worker` como string (es `node_type` enum).

**Relaciones**:
- `cluster()` (m2m) → un nodo puede estar en varios clusters (raro, pero la relación es m2m)

---

## 6. Groups

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/organization/groups` (+ `?with=type,members`)
**Recurso**: `App\Http\Resources\GroupResource`
**Form Request**: `StoreGroupRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | max 50 |
| `display_name` | string | – | añadir | "Team Payments" |
| `description` | text | ✓ | mantener | |
| `email` | email | – | añadir | |
| `icon` | string | – | añadir | nombre del icono Material |
| `label` | string | – | añadir | |
| `parent_id` | FK groups | – | añadir | jerarquía (sub-grupos) |
| `type_id` | FK group_types | – | añadir | team/security/admin |

**Eliminar del mockup**: `Source` (Internal/SSO/LDAP), `Default role` (Viewer/Editor/Admin), `Members` count, columna `Permissions`, columna `Owned systems`, `Visibility` (no son atributos del modelo).

**Relaciones**:
- `members()` (m2m → users vía `group_members` pivot)
- `type()` (BelongsTo)

> **Nota**: el `owner_id` de un System apunta a un Group, pero la inversa no es una relación
> directa. Para mostrar "owned systems" en un grupo hay que consultar
> `System::where('owner_id', $group->id)` en el front.

---

## 7. Users

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/organization/users` (+ `?with=groups,role`)
**Recurso**: `App\Http\Resources\UserResource`
**Form Request**: `StoreUserRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string | ✓ | mantener | max 255 |
| `email` | email unique | ✓ | mantener | |
| `email_verified_at` | datetime | – | añadir | |
| `password` | password (write-only) | – | (no se devuelve) | |
| `role` (relación) | FK roles | "Role: Admin" | mantener | cargar vía `?with=role` |
| `groups` (m2m) | – | "Groups" | mantener | cargar vía `?with=groups` |

**Eliminar del mockup**: `Status: Active/Invited/Suspended` (no es atributo), `Last active`, `Sessions`, `API tokens`, `MFA`, `SSO`, `Timezone`, `Joined` (no son atributos del modelo). La pestaña "API tokens" no debería existir — los tokens son de `ServiceAccountToken`, no de User.

**Relaciones**:
- `groups()` (m2m) ← el mockup confunde User con ServiceAccount
- `role()` (BelongsTo)

> **Decisión**: si el front quiere "Status" hay que añadirlo al modelo backend. Mientras no,
> la pantalla lo deja fuera. Lo mismo con `last_active_at` / `mfa_enabled` / `sso_required`.

---

## 8. Releases

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/ci-cd/releases` (+ `?with=component,workflowRun,artifacts,deployments`)
**Recurso**: `App\Http\Resources\ReleaseResource` (lo define explícitamente)
**Form Request**: `StoreReleaseRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `component_id` | FK components | ✓ | mantener | |
| `workflow_run_id` | FK workflow_runs | – | añadir | (nullable) |
| `version` | string | ✓ | mantener | unique per component |
| `status` | string | ✓ (Released/Rolled back) | mantener | string libre, no enum |
| `changelog` | text | – | añadir | |
| `metadata` | json | – | añadir | |
| `released_at` | date | – | añadir | |
| `created_at`, `updated_at` | datetime | – | añadir | |

**Eliminar del mockup**: `Author` (no es atributo del release — el mockup lo inventa; podría venir de `workflow_run.started_by`), `Stage` (es el mismo `status`), `Promoted to` (no es atributo del release — el release es unívoco por environment solo si el mockup quiere mostrar "promoted to production" eso va en `Deployment.environment_id`).

**Relaciones**:
- `component()` (BelongsTo)
- `workflowRun()` (BelongsTo)
- `deployments()` (HasMany)
- `artifacts()` (HasMany → `ReleaseArtifact`)

---

## 9. Deployments

**Endpoints**: `GET /api/v1/ci-cd/deployments`, `GET /api/v1/ci-cd/deployments/{id}`, **`POST /api/v1/ci-cd/webhooks/deployments`** (no se crean desde el catalog, se reciben por webhook)
**Recurso**: `App\Http\Resources\DeploymentResource` (explícito)
**Form Request**: `StoreDeploymentRequest` (sólo vía webhook, no hay Create en UI)

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `component_id` | FK | ✓ | mantener | |
| `environment_id` | FK | ✓ | mantener | |
| `cluster_id` | FK | ✓ | mantener | |
| `release_id` | FK | – | añadir | (nullable) |
| `version` | string | ✓ | mantener | |
| `commit_hash` | string (40) | – | añadir | |
| `docker_image_digest` | string | – | añadir | sha256:… |
| `workflow_run_id` | FK | – | añadir | |
| `triggered_by` | FK users | – | añadir | |
| `status` | enum (Pending/InProgress/Success/Failed/Cancelled/RolledBack) | ✓ | mantener | |
| `started_at` | datetime | "Deployed" | reemplazar | |
| `ended_at` | datetime | – | añadir | |
| `duration_milliseconds` | int | – | añadir | |
| `meta` | json | – | añadir | |

**Eliminar del mockup**: `Replicas`, `Strategy` (Rolling/Canary), `Namespace`, `Service account`, `Image override` (como inputs de Create — no se pueden crear deployments desde el catalog, vienen por webhook). El mockup actual tiene un drawer "New deployment" — **ese drawer no debería existir** o debería redirigir a "Configurar webhook".

**Relaciones**: `component`, `environment`, `cluster`, `release`, `workflowRun`, `triggerer` (todos BelongsTo).

---

## 10. CI Servers

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/ci-cd/servers` (+ `?with=credential,owner,workflowJobs`)
**Recurso**: `App\Http\Resources\CiServerResource`
**Form Request**: `StoreCiServerRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | max 100 |
| `driver` | string | "Type: GitHub Actions" | reemplazar | string libre ("github", "gitlab", "jenkins", "buildkite"…) |
| `url` | url | ✓ | mantener | |
| `credential_id` | FK credentials | "API token" | reemplazar | "Credential" (referencia a la tabla `credentials`) |
| `owner_id` | FK groups | ✓ | mantener | |
| `meta` | json | – | añadir | info del driver (org, repo, etc) |
| `is_enabled` | bool | "Status: Healthy" | reemplazar | true/false |
| `last_synced_at` | datetime | "Last run" | reemplazar | |

**Eliminar del mockup**: `Environment` (no es atributo), `API token` directo (ahora referencia a `credential`), columna "Status: Healthy/Degraded/Offline" (es `is_enabled` boolean).

> **Decisión**: el `driver` es string libre, no enum. El front debe mostrar el nombre humanizado
> ("github" → "GitHub Actions") con un mapping local. Drivers conocidos: github, gitlab,
> jenkins, buildkite, circleci, drone.

---

## 11. Workflows: Job (definición) + Run (ejecución)

> **Decisión de mockup**: hay que partir `workflows-*` en dos grupos:
> `workflows-jobs-*` (definiciones) y `workflow-runs-*` (ejecuciones).

### WorkflowJob — la definición

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/ci-cd/workflows/jobs` (vía `apiResource('workflows.jobs')`)
**Recurso**: `App\Http\Resources\WorkflowJobResource` (explícito)
**Form Request**: `StoreWorkflowJobRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string | ✓ | mantener | |
| `display_name` | string | – | añadir | |
| `description` | text | – | añadir | |
| `ci_server_id` | FK ci_servers | – | añadir | |
| `component_id` | FK components | – | añadir | |
| `url` | url | – | añadir | (en el CI server) |
| `is_enabled` | bool | – | añadir | |
| `discovery_source` | enum | – | añadir | |
| `last_synced_at` | datetime | – | añadir | |

**Eliminar del mockup**: el `triggers` ("push → main", "schedule · 02:00"), la YAML del pipeline
(esos viven en el CI server, no en el catalog), el `timeout` (idem). El "workflow" del mockup
actual es realmente un WorkflowJob con su última run encima.

**Relaciones**: `component()`, `workflowRuns()` (HasMany).

### WorkflowRun — una ejecución

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/ci-cd/workflows/runs` (+ `?with=workflowJob,commit`)
**Recurso**: `App\Http\Resources\WorkflowRunResource` (explícito)
**Form Request**: `StoreWorkflowRunRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `workflow_job_id` | FK | – | añadir | |
| `display_name` | string | "Run #1284" | reemplazar | |
| `description` | text | – | añadir | |
| `result` | enum (Aborted/Failure/NotBuilt/Success/Unstable) | "Success" | mantener | |
| `duration_milliseconds` | int | "3m 48s" | reemplazar | convertir a mm:ss en UI |
| `started_at` | datetime | "8m ago" | mantener | |
| `started_by` | FK users | – | añadir | |
| `url` | url | – | añadir | (link al CI server) |
| `is_enabled` | bool | – | añadir | |

**Relaciones**: `commit()` (HasOne → `WorkflowRunCommit`), `workflowJob()` (BelongsTo).

### WorkflowRunCommit (anidado)

| Campo | Tipo | Notas |
|---|---|---|
| `workflow_run_id` | FK | |
| `sha` | string | el SHA completo |
| `message` | string | mensaje del commit |
| `author_name` | string | |
| `author_email` | email | |
| `branch` | string | |
| `committed_at` | datetime | |

---

## 12. Environments

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/infrastructure/environments`
**Recurso**: `App\Http\Resources\EnvironmentResource`
**Form Request**: `StoreEnvironmentRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | max 50 |
| `display_name` | string | – | añadir | max 50 |
| `description` | text | – | añadir | |
| `type` | enum (development/staging/production/**testing**/**qa**) | "Production" | mantener | **NO "Sandbox"** |
| `abbr` | string(3) | – | añadir | "PROD", "STG" |
| `prefix` | string(3) | – | añadir | prefijo de namespace |
| `suffix` | string(3) | – | añadir | sufijo de namespace |
| `sort_order` | int | – | añadir | orden en la pipeline |
| `is_production_environment` | bool | – | añadir | |
| `display_in_matrix` | bool | – | añadir | |
| `approval_required` | bool | "Protected" | mantener | |
| `owner_id` | FK users | ✓ | mantener | **owner es un User, no un Group** |

**Eliminar del mockup**: `Clusters` (no es relación directa), `Namespaces` (idem), `Approval policy: 2 approvers / change window / freeze` (no son atributos). El "Approval required" sí existe pero como bool, no como objeto.

> **Decisión**: el "owner" en backend es un `User`, no un `Group`. Cambiar la FK en el mockup.

---

## 13. Resources (infra)

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/catalog/resources` (+ `?with=category`)
**Recurso**: `App\Http\Resources\ResourceResource`
**Form Request**: `StoreResourceRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | max 50 |
| `category_id` | FK categories | "Type: Database" | mantener | cargar nombre |

**Eliminar del mockup** (casi todo): `Connection string`, `Provider` (AWS RDS, GCP, …), `Region`, `System`, `Environment`, `Owner`, `Tags`, `Compliance checks` (encrypt at rest, TLS, backups), `Consumers` (no hay relación), `Access log` (no hay relación), `Schema` (no hay relación). **El modelo Resource es deliberadamente mínimo** — un "resource" en este catalog es solo un nombre categorizado.

> **Decisión**: el mockup actual está inflando Resource con cosas que no existen. Hay que
> drástico: o (a) dejar Resource con solo nombre + categoría, o (b) hacer un PR al backend para
> añadir `provider`, `region`, `connection_string`, `owner_id`, `tags`, `compliance`. Mientras
> no se haga (b), el front muestra solo lo que hay.

---

## 14. Links

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/catalog/links` (+ `?with=category`)
**Recurso**: `App\Http\Resources\LinkResource`
**Form Request**: `StoreLinkRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | |
| `url` | url | ✓ | mantener | |
| `description` | text | – | añadir | |
| `category_id` | FK categories | "Type: Docs" | mantener | |
| `model_name` | string | – | añadir | polimórfico: "App\\Models\\Component" |
| `model_id` | int | – | añadir | polimórfico: id del modelo relacionado |

**Eliminar del mockup**: `Type: Docs/Dashboard/Runbook/Repo/Wiki` (eso es el `category`), `Owner`, `Visibility`, `Status`, `Entity type + Entity` (eso se reemplaza por el par `model_name` + `model_id`).

---

## 15. BusinessCapabilities

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/architecture/business-capabilities` (+ `?with=systems,parent`)
**Recurso**: `App\Http\Resources\BusinessCapabilityResource` (explícito)
**Form Request**: `StoreBusinessCapabilityRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | |
| `description` | text | ✓ | mantener | |
| `parent_id` | FK (jerarquía) | – | añadir | capability padre |
| `strategic_value` | int 1-5 (Differentiator/Competitive/Core/Support/Commodity) | "Maturity: Optimised" | reemplazar | mostrar nombre del enum |
| `organization_id` | FK organizations | – | añadir | |

**Eliminar del mockup**: `Maturity` (Initial/Defined/Managed/Optimised — no es atributo), `Domain`, `Owner`, `Status` (Healthy/Degraded/At risk), `SLOs`, columna "Systems" (cuenta) — los systems son relación m2m.

**Relaciones**: `systems()` (m2m → pivot `business_capability_systems`).

---

## 16. BusinessDomains

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/architecture/business-domains` (+ `?with=parent,components,entities`)
**Recurso**: `App\Http\Resources\BusinessDomainResource` (explícito)
**Form Request**: `StoreBusinessDomainRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | |
| `display_name` | string | – | añadir | |
| `description` | text | ✓ | mantener | |
| `slug` | string unique | – | añadir | |
| `category` | string(1) (C=Core / G=Generic / S=Supporting) | – | añadir | chip |
| `is_enabled` | bool | "Status" | reemplazar | |
| `parent_id` | FK (jerarquía) | – | añadir | sub-dominio |

**Eliminar del mockup**: `Owner` (VP Commerce — el modelo no tiene `owner_id`), `Color` (no es atributo), `Systems`, `Capabilities`, `Components` columnas (son relaciones, no atributos).

**Relaciones**:
- `components()` (HasMany) — un dominio tiene componentes
- `entities()` (m2m) — entidades
- `parent()` (BelongsTo) — jerarquía

---

## 17. Entities (negocio)

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/architecture/entities` (+ `?with=components,attributes`)
**Recurso**: `App\Http\Resources\EntityResource`
**Form Request**: `StoreEntityRequest`

| Campo | Tipo | Mockup (actual) | Acción | Notas |
|---|---|---|---|---|
| `id` | int | ✓ | mantener | |
| `name` | string unique | ✓ | mantener | |
| `description` | text | ✓ | mantener | |
| `is_aggregate` | bool | – | añadir | chip |
| `is_aggregate_root` | bool | – | añadir | chip |
| `is_enabled` | bool | "Status: Healthy" | reemplazar | |
| `slug` | auto | – | añadir | |

**Eliminar del mockup**: `Domain`, `Owning system` (no es atributo del modelo — la relación es m2m con components), `Attributes` count (es una relación HasMany), `Coverage` (no existe), `PII classification` (no es atributo), `Schema attributes` (debe ser `EntityAttribute` real).

**Relaciones**:
- `attributes()` (HasMany → `EntityAttribute`) — cada attribute tiene: `name`, `type` (EntityType enum), `description`, `required` (bool), `is_pii` (bool), `sensitive` (bool)
- `components()` (m2m) — los componentes que manejan esta entidad

### EntityAttribute (nested)

**Endpoints**: `GET/POST/PUT/DELETE /api/v1/architecture/entities/{entity}/attributes` (vía `apiResource('entities.attributes')`)

| Campo | Tipo | Notas |
|---|---|---|
| `entity_id` | FK | |
| `name` | string | "email" |
| `display_name` | string | "Email address" |
| `description` | text | |
| `type` | enum EntityType (array/boolean/date/datetime/decimal/custom/integer/object/string/time/uuid/array<…>) | |
| `required` | bool | |
| `is_pii` | bool | |
| `sensitive` | bool | |
| `sort_order` | int | |

---

## 18. Lookup tables (Taxonomy / Settings)

Todas con `apiResource` (CRUD completo). El mockup `settings.html` dice "Taxonomy
management" pero no muestra NINGUNA. Hay que hacer páginas (o una sola página con tabs)
para:

### 18a. API taxonomy
- `api-categories` — categorías de API
- `api-types` — tipos de API (REST/gRPC/Async/WebSocket)
- `api-statuses` — estados de API (Active/Deprecated/Experimental)
- `api-access-policies` — políticas (Public/Internal/Partner/Composite)
- `authentication-methods` — métodos de auth (OAuth 2.0, mTLS, API Key, JWT…)

### 18b. Component / Cluster taxonomy
- `component-types` — service/library/worker/frontend
- `cluster-types` — EKS/GKE/AKS/OpenShift/On-prem
- `infrastructure-types` — cloud/on-prem/hybrid
- `lifecycle-phases` — Production/Beta/Deprecated/Experimental
- `service-statuses` — Healthy/Degraded/Offline
- `service-models` — SaaS/On-prem/Hybrid
- `business-tiers` — Tier 1/2/3

### 18c. Resource / Link taxonomy
- `link-categories` — Docs/Dashboard/Runbook/Repo/Wiki
- `resource-categories` — Database/Bucket/Queue/Topic/Cache/Secret

### 18d. Architecture taxonomy
- `business-domain-categories` — C/G/S (Core/Generic/Supporting)
- `vendors` — proveedores (AWS/GCP/Azure/On-prem)

### 18e. Tech taxonomy
- `frameworks` — frameworks (chi/sqlc/Express/Next/Spring)
- `platforms` — plataformas (Linux/Windows/macOS/K8s/Serverless)
- `programming-languages` — Go/TypeScript/Python/Java/Rust

### 18f. Organization taxonomy
- `group-types` — team/security/admin/compliance
- `group-member-roles` — admin/editor/viewer (NO confundir con Role de User)
- `roles` — rol global del usuario (relación User→Role)

**Patrón de cada página**: tabla simple con columnas name, slug, description, is_enabled. Mismo drawer Create/Edit. Es la página más aburrida del catalog, pero hay que hacerla.

---

## 19. Otras entidades CRUD (sin mockup)

### 19a. ServiceAccounts & ServiceAccountTokens

**ServiceAccount**:
- `name` string unique
- `description` text
- `owner_id` FK groups
- `is_enabled` bool
- `meta` json

**ServiceAccountToken** (anidado bajo service-accounts):
- `service_account_id` FK
- `name` string
- `token_hash` string (no se devuelve, solo el `token_plain` en la creación)
- `scopes` json
- `expires_at` datetime
- `last_used_at` datetime
- `is_enabled` bool

### 19b. Credentials

- `name` string unique
- `type` enum CredentialType (no_auth, basic_auth, api_token, bearer_token, certificate, secret_text, ssh_key, oauth2, aws_iam, k8s_service_account, gpg_key)
- `username` string (nullable)
- `secret` string (encrypt at rest, no se devuelve)
- `owner_id` FK groups
- `is_enabled` bool
- `meta` json

### 19c. ComplianceRequirements

- `name` string unique
- `description` text
- `standard_id` FK compliance_standards
- `controls` json (lista de controles del standard)
- `is_enabled` bool

`compliance-standards` también es CRUD:
- `name` string (PCI-DSS, SOC 2, ISO 27001…)
- `version` string (4.0, 2.0…)
- `description` text
- `url` url (link al standard)
- `is_enabled` bool

### 19d. Webhooks

- `POST /api/v1/webhooks/deployments` — recibe eventos de deployments de los CI servers
  y crea/actualiza el registro `Deployment` correspondiente. No es una entidad CRUD, es un
  endpoint de entrada.

---

## 20. Resumen de acciones por página

| Página | Estado | Acción prioritaria |
|---|---|---|
| `component-detail` | ⚠️ inflar con Language/Framework/Repo | Reescribir KV (ver §1) |
| `api-detail` | ✅ casi bien | Sustituir "System" por nada, añadir protocol/released_at |
| `system-detail` | ❌ no existe | Crear (es muy simple: solo name+desc+owner+tags) |
| `cluster-detail` | ⚠️ inflar con Nodes/CPU/Memory | Reescribir (ver §4) |
| `node-detail` | ❌ instancia/role/vCPU/taints | Reescribir por completo (ver §5) |
| `group-detail` | ⚠️ inflar con Source/Role/Permissions | Reescribir (ver §6) |
| `user-detail` | ❌ role/status/sessions/MFA | Reescribir (ver §7) |
| `release-detail` | ⚠️ Author/Stage/Promoted-to | Reescribir (ver §8) |
| `deployment-detail` | ⚠️ Replicas/Strategy/Namespace | Reescribir (ver §9) |
| `ci-server-detail` | ⚠️ Type→Driver, Token→Credential | Reescribir (ver §10) |
| `workflow-detail` | ❌ conflación Job+Run | Partir en dos páginas (ver §11) |
| `environment-detail` | ⚠️ clusters/namespaces/approval policy | Reescribir (ver §12) |
| `resource-detail` | ❌ connection/provider/compliance/schema | Reescribir (ver §13) |
| `link-detail` | ⚠️ Owner/Visibility/Status | Reescribir (ver §14) |
| `capability-detail` | ⚠️ Maturity/Domain/SLOs | Reescribir (ver §15) |
| `domain-detail` | ⚠️ Owner/Color | Reescribir (ver §16) |
| `entity-detail` | ❌ Domain/Owning system/Coverage/PII | Reescribir (ver §17) |

**PAGINAS NUEVAS** (no existen en mockup, hay que crear):
- `system-detail` (entidad muy simple)
- `workflow-runs-list`, `workflow-run-detail` (separar de workflows-list)
- `workflow-jobs-list`, `workflow-jobs-detail` (renombrar workflows-list actual)
- `service-accounts-list`, `service-account-detail`
- `credentials-list`, `credential-detail`
- `compliance-requirements-list`, `compliance-requirement-detail`
- `compliance-standards-list`, `compliance-standard-detail`
- Páginas de Settings/Taxonomy: una sola página `settings.html` con tabs por dominio (api, component, cluster, resource, link, org), o N páginas `settings-<x>.html` separadas. **Decidir.**
- Página de **Webhooks** (mostrar URL, secret, eventos, log) — la `webhooks/deployments` ya existe en backend

---

## 21. Decisiones a tomar con el equipo backend

Antes de hacer las páginas, hay decisiones que solo el equipo backend puede responder:

1. **System**: ¿se queda minimal (name/desc/owner/tags) o se le añade `domain_id`, `tier_id`, `architecture`, `criticality`? El mockup actual asume un System "rico" — el backend no lo tiene.
2. **Resource**: ¿se le añade `provider`, `region`, `connection_string`, `owner_id`, `tags`, `compliance`? El Resource del backend es deliberadamente mínimo.
3. **Deployment**: ¿se le añaden `replicas`, `strategy`, `namespace`, `service_account`, `image_override`? El backend dice que los deployments llegan por webhook, no se crean desde el catalog.
4. **User**: ¿se le añaden `status`, `last_active_at`, `mfa_enabled`, `sso_required`? El User del backend es deliberadamente minimal.
5. **WorkflowJob**: ¿el YAML del pipeline es parte del modelo, o vive en el CI server? El mockup actual muestra YAML en el detalle del workflow.
6. **Owner en Environment**: ¿es un User o un Group? El mockup lo trata como Group; el backend dice User.
7. **CI Server `type` → `driver`**: ¿el driver es string libre o se convierte en enum? El backend actual lo deja libre.
8. **Taxonomy**: ¿una sola página `settings.html` con tabs, o N páginas separadas? El backend tiene ~25 tablas lookup.

Mientras estas decisiones no estén tomadas, el front se adapta al backend tal cual está.
