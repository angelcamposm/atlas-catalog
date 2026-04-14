# 📚 Atlas Catalog - Referencia de API Backend

Este documento describe la estructura de datos del backend Laravel y cómo se relacionan con las pantallas del frontend.

## 🌐 Base URL

```
http://localhost:8000/api/v1
```

---

## 📦 Estructura de Respuestas

### Respuesta Individual (Single Resource)

```json
{
    "data": {
        "id": 1,
        "name": "Example",
        "description": "...",
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00",
        "created_by": 1,
        "updated_by": 1
    }
}
```

### Respuesta Paginada (Collection)

```json
{
    "data": [
        { "id": 1, "name": "Item 1", ... },
        { "id": 2, "name": "Item 2", ... }
    ],
    "links": {
        "first": "http://localhost:8000/api/v1/resource?page=1",
        "last": "http://localhost:8000/api/v1/resource?page=5",
        "prev": null,
        "next": "http://localhost:8000/api/v1/resource?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 5,
        "path": "http://localhost:8000/api/v1/resource",
        "per_page": 15,
        "to": 15,
        "total": 75
    }
}
```

---

## 🗂️ Dominios y Entidades

### 1. 📡 API Domain

#### APIs (`/v1/apis`)

Catálogo principal de APIs del sistema.

| Campo                      | Tipo      | Descripción                    |
| -------------------------- | --------- | ------------------------------ |
| `id`                       | integer   | ID único                       |
| `name`                     | string    | Nombre de la API               |
| `display_name`             | string?   | Nombre para mostrar            |
| `description`              | string?   | Descripción                    |
| `url`                      | string?   | URL de la API                  |
| `version`                  | string?   | Versión (ej: "v1.0.0")         |
| `protocol`                 | enum      | `http` \| `https`              |
| `document_specification`   | json?     | Especificación OpenAPI/Swagger |
| `released_at`              | datetime? | Fecha de lanzamiento           |
| `deprecated_at`            | datetime? | Fecha de deprecación           |
| `deprecation_reason`       | string?   | Razón de deprecación           |
| `access_policy_id`         | integer?  | FK a ApiAccessPolicy           |
| `authentication_method_id` | integer?  | FK a AuthenticationMethod      |
| `category_id`              | integer?  | FK a ApiCategory               |
| `status_id`                | integer?  | FK a ApiStatus                 |
| `type_id`                  | integer?  | FK a ApiType                   |
| `deprecated_by`            | integer?  | FK a User                      |
| `created_by`               | integer?  | FK a User                      |
| `updated_by`               | integer?  | FK a User                      |

**Ejemplo de respuesta:**

```json
{
    "data": {
        "id": 1,
        "name": "payment-gateway",
        "display_name": "Payment Gateway API",
        "description": "API REST para procesamiento de pagos",
        "url": "https://api.example.com/payments",
        "version": "v2.3.1",
        "protocol": "https",
        "document_specification": { "openapi": "3.0.0", ... },
        "released_at": "2024-01-15 00:00:00",
        "deprecated_at": null,
        "access_policy_id": 2,
        "authentication_method_id": 1,
        "category_id": 3,
        "status_id": 2,
        "type_id": 1,
        "created_at": "2024-01-01 10:00:00",
        "updated_at": "2024-06-15 14:30:00",
        "created_by": 1,
        "updated_by": 2
    }
}
```

#### API Types (`/v1/apis/types`)

Tipos de API disponibles.

| Campo         | Tipo    | Descripción     |
| ------------- | ------- | --------------- |
| `id`          | integer | ID único        |
| `name`        | string  | Nombre del tipo |
| `description` | string? | Descripción     |

**Datos de ejemplo (seed):**

-   REST, GraphQL, gRPC, SOAP, WebSockets, Webhooks, JSON-RPC, XML-RPC, Avro

#### API Statuses (`/v1/apis/statuses`)

Estados del ciclo de vida de APIs.

**Datos de ejemplo (seed):**

-   Draft, Published, Deprecated, Retired, Blocked

#### API Categories (`/v1/apis/categories`)

Categorías de APIs.

| Campo         | Tipo    | Descripción                    |
| ------------- | ------- | ------------------------------ |
| `id`          | integer | ID único                       |
| `name`        | string  | Nombre de la categoría         |
| `description` | string? | Descripción                    |
| `icon`        | string? | Icono (nombre de clase o path) |

#### API Access Policies (`/v1/apis/access-policies`)

Políticas de acceso a APIs.

| Campo         | Tipo    | Descripción           |
| ------------- | ------- | --------------------- |
| `id`          | integer | ID único              |
| `name`        | string  | Nombre de la política |
| `description` | string? | Descripción           |

---

### 2. 🏢 Business Domain

#### Business Domains (`/v1/business-domains`)

Dominios de negocio para organización.

| Campo          | Tipo     | Descripción                   |
| -------------- | -------- | ----------------------------- |
| `id`           | integer  | ID único                      |
| `name`         | string   | Nombre del dominio            |
| `display_name` | string?  | Nombre para mostrar           |
| `description`  | string?  | Descripción                   |
| `category`     | enum     | Core \| Supporting \| Generic |
| `is_active`    | boolean  | Si está activo                |
| `parent_id`    | integer? | FK al dominio padre           |

**Datos de ejemplo (seed):**

-   **Core**: Sales, Orders, Customers, Products, Content
-   **Supporting**: Billing & Invoicing, Inventory, Shipping & Fulfillment, Marketing
-   **Generic**: Identity, Notifications, File Storage

#### Business Tiers (`/v1/business-tiers`)

Niveles de criticidad de negocio.

| Campo         | Tipo    | Descripción     |
| ------------- | ------- | --------------- |
| `id`          | integer | ID único        |
| `name`        | string  | Nombre del tier |
| `code`        | string? | Código corto    |
| `description` | string? | Descripción     |

---

### 3. 🌍 Environments & Lifecycles

#### Environments (`/v1/environments`)

Entornos de despliegue.

| Campo                       | Tipo     | Descripción                           |
| --------------------------- | -------- | ------------------------------------- |
| `id`                        | integer  | ID único                              |
| `name`                      | string   | Nombre del entorno                    |
| `abbr`                      | string?  | Abreviación (dev, int, uat, stg, pro) |
| `description`               | string?  | Descripción                           |
| `display_in_matrix`         | boolean  | Mostrar en matriz                     |
| `is_production_environment` | boolean  | Es producción                         |
| `approval_required`         | boolean  | Requiere aprobación                   |
| `sort_order`                | integer  | Orden de visualización                |
| `prefix`                    | string?  | Prefijo                               |
| `suffix`                    | string?  | Sufijo                                |
| `owner_id`                  | integer? | FK a User/Group                       |

**Datos de ejemplo (seed):**

```
| Name               | Abbr | Sort | Production | Approval |
|--------------------|------|------|------------|----------|
| Development        | dev  | 10   | false      | false    |
| Integration        | int  | 20   | false      | false    |
| Acceptance Testing | uat  | 30   | false      | false    |
| Staging            | stg  | 40   | false      | false    |
| Production         | pro  | 50   | true       | true     |
| Sandbox            | sbx  | 0    | false      | false    |
```

#### Lifecycles (`/v1/lifecycles`)

Estados del ciclo de vida de servicios/componentes.

| Campo               | Tipo    | Descripción                                             |
| ------------------- | ------- | ------------------------------------------------------- |
| `id`                | integer | ID único                                                |
| `name`              | string  | Nombre del lifecycle                                    |
| `description`       | string? | Descripción                                             |
| `color`             | string? | Color para UI (primary, warning, success, danger, etc.) |
| `approval_required` | boolean | Requiere aprobación                                     |

**Datos de ejemplo (seed):**

```
| Name           | Color     | Description                                    |
|----------------|-----------|------------------------------------------------|
| Experimental   | primary   | Componente experimental, sin garantías         |
| In development | warning   | En fase de desarrollo                          |
| In testing     | (none)    | En pruebas                                     |
| In maintenance | secondary | No recibe nuevas funciones, solo mantenimiento |
| In retirement  | dark      | Oficialmente retirado                          |
| In production  | success   | Establecido, mantenido y en producción         |
| Obsolete       | danger    | Al final de su ciclo de vida                   |
```

---

### 4. 🏗️ Infrastructure (Clusters & Nodes)

#### Clusters (`/v1/clusters`)

Clusters de Kubernetes u otras plataformas.

| Campo                    | Tipo     | Descripción               |
| ------------------------ | -------- | ------------------------- |
| `id`                     | integer  | ID único                  |
| `name`                   | string   | Nombre del cluster        |
| `display_name`           | string?  | Nombre para mostrar       |
| `api_url`                | string?  | URL de la API del cluster |
| `cluster_uuid`           | string?  | UUID único del cluster    |
| `full_version`           | string?  | Versión completa          |
| `version`                | string?  | Versión corta             |
| `url`                    | string?  | URL del dashboard         |
| `has_licensing`          | boolean  | Tiene licencia            |
| `licensing_model`        | string?  | Modelo de licencia        |
| `lifecycle_id`           | integer? | FK a Lifecycle            |
| `infrastructure_type_id` | integer? | FK a InfrastructureType   |
| `vendor_id`              | integer? | FK a Vendor               |
| `type_id`                | integer? | FK a ClusterType          |
| `tags`                   | string?  | Tags JSON                 |
| `timezone`               | string?  | Timezone                  |

#### Cluster Types (`/v1/clusters/types`)

Tipos de clusters soportados.

| Campo        | Tipo     | Descripción     |
| ------------ | -------- | --------------- |
| `id`         | integer  | ID único        |
| `name`       | string   | Nombre del tipo |
| `icon`       | string?  | Icono           |
| `is_enabled` | boolean  | Habilitado      |
| `vendor_id`  | integer? | FK a Vendor     |

**Datos de ejemplo (seed):**

-   Amazon EKS, Google Kubernetes Engine, Azure Kubernetes Service
-   Red Hat OpenShift Container Platform, OpenShift Dedicated
-   Rancher, VMware Tanzu, Kubernetes (vanilla)

#### Nodes (`/v1/nodes`)

Nodos individuales de clusters.

| Campo                   | Tipo     | Descripción                  |
| ----------------------- | -------- | ---------------------------- |
| `id`                    | integer  | ID único                     |
| `name`                  | string   | Nombre del nodo              |
| `ip_address`            | string   | Dirección IP                 |
| `fqdn`                  | string?  | FQDN                         |
| `mac_address`           | string?  | MAC Address                  |
| `is_virtual`            | boolean  | Es virtual                   |
| `node_type`             | string   | Tipo (V=Virtual, P=Physical) |
| `cpu_architecture`      | string   | Arquitectura (x86, arm64)    |
| `cpu_count`             | integer  | Número de CPUs               |
| `cpu_sockets`           | integer  | Sockets                      |
| `cpu_type`              | string?  | Tipo de CPU                  |
| `memory_bytes`          | integer? | Memoria en bytes             |
| `os`                    | string?  | Sistema operativo            |
| `os_version`            | string?  | Versión del SO               |
| `lifecycle_id`          | integer? | FK a Lifecycle               |
| `operational_status_id` | integer? | FK a OperationalStatus       |
| `discovery_source`      | string?  | Fuente de descubrimiento     |
| `timezone`              | string?  | Timezone                     |

---

### 5. 🧩 Components & Systems

#### Components (no hay endpoint directo aún)

Microservicios y componentes de software.

| Campo              | Tipo     | Descripción                |
| ------------------ | -------- | -------------------------- |
| `id`               | integer  | ID único                   |
| `name`             | string   | Nombre del componente      |
| `display_name`     | string?  | Nombre para mostrar        |
| `description`      | string?  | Descripción                |
| `slug`             | string   | Slug URL-friendly          |
| `discovery_source` | enum     | SCAN \| PIPELINE \| MANUAL |
| `is_exposed`       | boolean  | Expuesto externamente      |
| `is_stateless`     | boolean  | Sin estado                 |
| `tags`             | json?    | Tags                       |
| `domain_id`        | integer? | FK a BusinessDomain        |
| `lifecycle_id`     | integer? | FK a Lifecycle             |
| `platform_id`      | integer? | FK a Platform              |
| `tier_id`          | integer? | FK a BusinessTier          |
| `owner_id`         | integer? | FK a Group                 |

#### Systems

Agrupación lógica de componentes.

| Campo          | Tipo     | Descripción         |
| -------------- | -------- | ------------------- |
| `id`           | integer  | ID único            |
| `name`         | string   | Nombre del sistema  |
| `display_name` | string?  | Nombre para mostrar |
| `description`  | string?  | Descripción         |
| `tags`         | string?  | Tags                |
| `owner_id`     | integer? | FK a Group          |

---

### 6. 💻 Technology Domain

#### Platforms (`/v1/platforms`)

Plataformas de despliegue.

| Campo         | Tipo    | Descripción |
| ------------- | ------- | ----------- |
| `id`          | integer | ID único    |
| `name`        | string  | Nombre      |
| `description` | string? | Descripción |
| `icon`        | string? | Icono       |

**Datos de ejemplo:** Web, iOS, Android, Desktop, API

#### Programming Languages (`/v1/programming-languages`)

Lenguajes de programación.

| Campo        | Tipo    | Descripción         |
| ------------ | ------- | ------------------- |
| `id`         | integer | ID único            |
| `name`       | string  | Nombre del lenguaje |
| `icon`       | string? | Path al icono       |
| `is_enabled` | boolean | Habilitado          |
| `url`        | string? | URL documentación   |

**Datos de ejemplo:** Java, Python, JavaScript, TypeScript, Go, Rust, PHP, Ruby, C#, Kotlin, etc.

#### Frameworks (`/v1/frameworks`)

Frameworks de desarrollo.

| Campo         | Tipo    | Descripción              |
| ------------- | ------- | ------------------------ |
| `id`          | integer | ID único                 |
| `name`        | string  | Nombre                   |
| `description` | string? | Descripción              |
| `icon`        | string? | Icono                    |
| `is_enabled`  | boolean | Habilitado               |
| `url`         | string? | URL                      |
| `language_id` | integer | FK a ProgrammingLanguage |

#### Vendors (`/v1/vendors`)

Proveedores de tecnología.

| Campo  | Tipo    | Descripción       |
| ------ | ------- | ----------------- |
| `id`   | integer | ID único          |
| `name` | string  | Nombre del vendor |
| `icon` | string? | Icono             |
| `url`  | string? | URL               |

---

### 7. 👥 Organization Domain

#### Groups (`/v1/groups`)

Equipos y grupos de usuarios.

| Campo         | Tipo     | Descripción       |
| ------------- | -------- | ----------------- |
| `id`          | integer  | ID único          |
| `name`        | string   | Nombre del grupo  |
| `description` | string?  | Descripción       |
| `email`       | string?  | Email de contacto |
| `icon`        | string?  | Icono             |
| `label`       | string?  | Etiqueta          |
| `parent_id`   | integer? | FK a Group padre  |
| `type_id`     | integer? | FK a GroupType    |

#### Group Types (`/v1/groups/types`)

Tipos de grupos.

| Campo         | Tipo    | Descripción     |
| ------------- | ------- | --------------- |
| `id`          | integer | ID único        |
| `name`        | string  | Nombre del tipo |
| `description` | string? | Descripción     |

**Datos de ejemplo:** Team, Department, Squad, Guild, Chapter

#### Group Member Roles (`/v1/groups/member-roles`)

Roles dentro de los grupos.

| Campo         | Tipo    | Descripción    |
| ------------- | ------- | -------------- |
| `id`          | integer | ID único       |
| `name`        | string  | Nombre del rol |
| `description` | string? | Descripción    |

---

### 8. 🔐 Security Domain

#### Authentication Methods (`/v1/authentication-methods`)

Métodos de autenticación para APIs.

| Campo         | Tipo    | Descripción       |
| ------------- | ------- | ----------------- |
| `id`          | integer | ID único          |
| `name`        | string  | Nombre del método |
| `description` | string? | Descripción       |

**Datos de ejemplo:** API Key, OAuth 2.0, JWT, Basic Auth, mTLS, SAML

#### Service Accounts (`/v1/service-accounts`)

Cuentas de servicio para automatización.

| Campo       | Tipo    | Descripción         |
| ----------- | ------- | ------------------- |
| `id`        | integer | ID único            |
| `name`      | string  | Nombre de la cuenta |
| `namespace` | string? | Namespace           |

---

### 9. 📋 Compliance Domain

#### Compliance Standards (`/v1/compliance-standards`)

Estándares de cumplimiento.

| Campo          | Tipo    | Descripción         |
| -------------- | ------- | ------------------- |
| `id`           | integer | ID único            |
| `name`         | string  | Nombre del estándar |
| `display_name` | string? | Nombre para mostrar |
| `description`  | string? | Descripción         |
| `country_code` | string? | Código de país      |
| `focus_area`   | string? | Área de enfoque     |
| `industry`     | string? | Industria           |
| `url`          | string? | URL referencia      |

**Datos de ejemplo:** GDPR, HIPAA, SOC 2, PCI-DSS, ISO 27001

---

### 10. 🔗 Links Domain

#### Links (`/v1/links`)

Enlaces externos relacionados con recursos.

| Campo         | Tipo     | Descripción                               |
| ------------- | -------- | ----------------------------------------- |
| `id`          | integer  | ID único                                  |
| `name`        | string?  | Nombre del enlace                         |
| `description` | string?  | Descripción                               |
| `url`         | string?  | URL                                       |
| `type_id`     | integer? | FK a LinkCategory                         |
| `model_name`  | string?  | Modelo relacionado (Api, Component, etc.) |
| `model_id`    | integer? | ID del modelo relacionado                 |

#### Link Categories (`/v1/links/categories`)

Categorías de enlaces.

| Campo         | Tipo    | Descripción            |
| ------------- | ------- | ---------------------- |
| `id`          | integer | ID único               |
| `name`        | string  | Nombre de la categoría |
| `description` | string? | Descripción            |
| `icon`        | string? | Icono                  |

**Datos de ejemplo:** Documentation, Repository, Dashboard, Wiki, Runbook

---

## 🎨 Mapeo a Pantallas del Frontend

### Dashboard Principal

```
Métricas a obtener:
- GET /v1/apis?per_page=0 → meta.total (total APIs)
- GET /v1/clusters?per_page=0 → meta.total (total clusters)
- GET /v1/nodes?per_page=0 → meta.total (total nodes)
- GET /v1/groups?per_page=0 → meta.total (total teams)
```

### Catálogo de APIs

```
Lista: GET /v1/apis
Detalle: GET /v1/apis/{id}
Filtros auxiliares:
  - GET /v1/apis/types
  - GET /v1/apis/statuses
  - GET /v1/apis/categories
  - GET /v1/authentication-methods
```

### Infraestructura

```
Clusters: GET /v1/clusters
Nodes: GET /v1/nodes
Tipos: GET /v1/clusters/types
Filtros:
  - GET /v1/lifecycles
  - GET /v1/vendors
```

### Organización

```
Grupos: GET /v1/groups
Tipos de grupo: GET /v1/groups/types
Roles: GET /v1/groups/member-roles
```

### Administración (Taxonomías)

```
- GET /v1/lifecycles
- GET /v1/environments
- GET /v1/business-domains
- GET /v1/business-tiers
- GET /v1/platforms
- GET /v1/programming-languages
- GET /v1/frameworks
- GET /v1/vendors
```

---

## 🔄 Relaciones entre Entidades

```
┌─────────────────────────────────────────────────────────────────┐
│                     MODELO DE RELACIONES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐      ┌──────────────┐      ┌──────────┐          │
│  │   API    │──────│  Component   │──────│  System  │          │
│  └──────────┘      └──────────────┘      └──────────┘          │
│       │                   │                   │                  │
│       ▼                   ▼                   ▼                  │
│  ┌──────────┐      ┌──────────────┐      ┌──────────┐          │
│  │ ApiType  │      │BusinessDomain│      │  Group   │          │
│  │ApiStatus │      │  Lifecycle   │      │ (Owner)  │          │
│  │ApiCategory│     │  Platform    │      └──────────┘          │
│  └──────────┘      │ BusinessTier │                             │
│                    └──────────────┘                             │
│                                                                  │
│  ┌──────────┐      ┌──────────────┐      ┌──────────┐          │
│  │ Cluster  │──────│    Node      │      │  Vendor  │          │
│  └──────────┘      └──────────────┘      └──────────┘          │
│       │                                       │                  │
│       ▼                                       │                  │
│  ┌──────────┐      ┌──────────────┐          │                  │
│  │ClusterType│─────│              │◄─────────┘                  │
│  │ Lifecycle│      │Infrastructure │                            │
│  └──────────┘      │    Type       │                            │
│                    └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Notas para Desarrollo Frontend

1. **Todos los endpoints soportan paginación** por defecto con 15 items/página
2. **Todos los modelos incluyen** `created_at`, `updated_at`, `created_by`, `updated_by`
3. **Los Resources devuelven** todos los campos del modelo (usando `parent::toArray()`)
4. **Para obtener relaciones**, usar query params: `?with=lifecycle,type,vendor`
5. **Para filtrar**, usar query params estándar de Laravel
6. **Códigos de estado**:
    - 200: OK (GET, PUT exitosos)
    - 201: Created (POST exitoso)
    - 204: No Content (DELETE exitoso)
    - 400: Bad Request (datos inválidos)
    - 404: Not Found
    - 422: Validation Error
    - 500: Server Error
