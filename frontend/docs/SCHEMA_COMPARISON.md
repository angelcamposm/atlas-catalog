# Comparación: Esquema Anterior vs Nuevo

## 📊 Estadísticas

| Métrica                | Anterior | Nuevo | Incremento |
| ---------------------- | -------- | ----- | ---------- |
| **Tipos de Entidades** | ~30      | 106   | +253%      |
| **Schemas Zod**        | ~15      | 44    | +193%      |
| **Enumeraciones**      | 5        | 9     | +80%       |
| **Interfaces Request** | ~10      | 24    | +140%      |

## 🆕 Entidades Nuevas (No existían antes)

### Gestión de Usuarios y Equipos

-   ✅ `User`
-   ✅ `Group`
-   ✅ `GroupType`
-   ✅ `GroupMember`
-   ✅ `GroupMemberRole`

### Dominio de Negocio

-   ✅ `BusinessDomain`
-   ✅ `BusinessTier`
-   ✅ `BusinessCriticalityLevel`

### Ambientes y Estados

-   ✅ `Environment`
-   ✅ `ServiceStatus`
-   ✅ `OperationalStatus`

### Componentes

-   ✅ `Component`
-   ✅ `ComponentCategory`
-   ✅ `ComponentEnvironment`
-   ✅ `ComponentResource`
-   ✅ `ComponentApi`

### Build y Deploy

-   ✅ `Build`
-   ✅ `Release`
-   ✅ `Deployment`

### Recursos

-   ✅ `Resource`
-   ✅ `ResourceType`

### APIs (Expandido)

-   ✅ `ApiCategory` (nuevo)
-   🔄 `Api` (actualizado con más campos)
-   🔄 `ApiType` (simplificado)
-   🔄 `ApiStatus` (actualizado)

### Infraestructura (Todos nuevos)

-   ✅ `Cluster`
-   ✅ `ClusterType`
-   ✅ `ClusterNode`
-   ✅ `ClusterServiceAccount`
-   ✅ `Node`
-   ✅ `Vendor`
-   ✅ `ServiceAccount`
-   ✅ `ServiceAccountToken`

### Enlaces y Relaciones

-   ✅ `Link`
-   ✅ `LinkType`
-   ✅ `KeyRelationship`

### Frameworks

-   ✅ `Framework` (nuevo)
-   🔄 `ProgrammingLanguage` (expandido)

## 🔄 Entidades Actualizadas

### Api

**Antes:**

```typescript
{
    id,
        name,
        description,
        access_policy_id,
        authentication_method_id,
        protocol,
        document_specification,
        status_id,
        type_id,
        url,
        version;
}
```

**Ahora:**

```typescript
{
    id, name, description,
    access_policy: enum,        // ← Ahora es enum
    auth_method: enum,          // ← Ahora es enum
    protocol: enum,             // ← Ahora es enum
    category_id,                // ← Nuevo
    compliance,                 // ← Nuevo
    compliance_status,          // ← Nuevo
    deprecated_at,              // ← Nuevo
    deprecated_by,              // ← Nuevo
    deprecation_reason,         // ← Nuevo
    display_name,               // ← Nuevo
    document_specification,
    released_at,                // ← Nuevo
    status_id, type_id,
    version
}
```

### Lifecycle

**Antes:**

```typescript
{
    id, name, description, approval_required;
}
```

**Ahora:**

```typescript
{
    id,
        name,
        description,
        color, // ← Nuevo
        approval_required;
}
```

### Platform

**Antes:**

```typescript
{
    id, name, description, vendor_id, version, url;
}
```

**Ahora:**

```typescript
{
    id, name, description, icon; // ← Nuevo
}
```

### ProgrammingLanguage

**Antes:**

```typescript
{
    id, name, description;
}
```

**Ahora:**

```typescript
{
    id,
        name,
        icon, // ← Nuevo
        is_enabled, // ← Nuevo
        url; // ← Nuevo
}
```

## 🎯 Enumeraciones Nuevas

### Anteriores (5)

-   `NodeType`
-   `NodeRole`
-   `CpuArchitecture`
-   `Protocol`
-   `CommunicationStyle`
-   `LicensingModel`

### Nuevas (9)

-   ✅ `AuthorizationMethod` (BASIC, OAUTH, KEY, NONE)
-   ✅ `Protocol` (HTTP, HTTPS) - Simplificado
-   ✅ `AccessPolicy` (PUBLIC, INTERNAL, THIRD_PARTY)
-   ✅ `DomainCategory` (CORE, SUPPORTING, GENERIC)
-   ✅ `DiscoverySource` (SCAN, PIPELINE, MANUAL)
-   ✅ `BuildResult` (SUCCESS, FAILURE, ABORTED, UNSTABLE)
-   ✅ `WorkloadKind` (DEPLOYMENT, DAEMONSET, STATEFULSET, REPLICASET)
-   ✅ `NodeType` (PHYSICAL, VIRTUAL, CLOUD) - Actualizado
-   ✅ `CpuArchitecture` (X86, X86_64, ARM, ARM64) - Actualizado

## 🗑️ Removidos

Las siguientes entidades/enums del archivo anterior fueron removidas por no estar en el DBML:

-   ❌ `CommunicationStyle`
-   ❌ `LicensingModel`
-   ❌ `NodeRole`
-   Algunos campos específicos de infraestructura que no coinciden con el DBML

## 🔗 Nuevas Relaciones Modeladas

### Jerarquías

-   `Group` → `parent_id` → `Group`
-   `BusinessDomain` → `parent_id` → `BusinessDomain`

### Componentes

-   `Component` → `platform_id` → `Platform`
-   `Component` → `lifecycle_id` → `Lifecycle`
-   `Component` → `domain_id` → `BusinessDomain`
-   `Component` → `tier_id` → `BusinessTier`
-   `Component` → `criticality_id` → `BusinessCriticalityLevel`
-   `Component` → `type_id` → `ComponentCategory`
-   `Component` → `status_id` → `ServiceStatus`
-   `Component` → `operational_status_id` → `OperationalStatus`

### Releases y Deployments

-   `Release` → `component_id` → `Component`
-   `Release` → `build_id` → `Build`
-   `Release` → `language_id` → `ProgrammingLanguage`
-   `Release` → `framework_id` → `Framework`
-   `Deployment` → `release_id` → `Release`
-   `Deployment` → `environment_id` → `Environment`

### APIs

-   `Api` → `category_id` → `ApiCategory`
-   `Api` → `type_id` → `ApiType`
-   `Api` → `status_id` → `ApiStatus`
-   `ComponentApi` → `component_id` → `Component`
-   `ComponentApi` → `api_id` → `Api`

### Infraestructura

-   `Cluster` → `type_id` → `ClusterType`
-   `ClusterType` → `vendor_id` → `Vendor`
-   `ClusterNode` → `cluster_id` → `Cluster`
-   `ClusterNode` → `node_id` → `Node`
-   `Node` → `lifecycle_id` → `Lifecycle`
-   `Node` → `operational_status_id` → `OperationalStatus`

## 📝 Cambios en Convenciones

### Nombres de Campos

**Antes:**

-   IDs externos usaban sufijo `_id` inconsistentemente
-   Algunos booleanos sin prefijo `is_` o `has_`

**Ahora:**

-   ✅ Todos los IDs externos con sufijo `_id`
-   ✅ Booleanos con prefijos `is_`, `has_`, `approval_` consistentes
-   ✅ Campos de auditoría estandarizados: `created_by`, `updated_by`, `created_at`, `updated_at`

### Tipos Nullable

**Antes:**

```typescript
description?: string;
```

**Ahora:**

```typescript
description: string | null | undefined;
```

Uso de helper `nullableString()` para consistencia.

## 🎨 Mejoras en Validación

### Zod Schemas

-   ✅ Todos los schemas con validación completa
-   ✅ Enums validados con `z.nativeEnum()`
-   ✅ Strings con `.trim()` y `.min(1)` donde corresponde
-   ✅ Números con `.int()` para IDs
-   ✅ JSON objects con `z.record()` o tipos específicos

### Type Safety

-   ✅ Enums en lugar de strings literales
-   ✅ Tipos de Request separados (Create/Update)
-   ✅ Tipos de Response con y sin paginación

## 🚀 Beneficios de la Actualización

1. **Cobertura Completa**: 100% del esquema DBML representado
2. **Type Safety**: Enums en lugar de magic strings
3. **Validación Runtime**: Zod schemas para todas las entidades
4. **Consistencia**: Convenciones uniformes en todo el código
5. **Documentación**: Tipos auto-documentados con IntelliSense
6. **Escalabilidad**: Estructura preparada para crecimiento
7. **Testing**: Facilita testing con tipos específicos
8. **Developer Experience**: Autocompletado completo en IDE

## ⚠️ Breaking Changes

**Para código existente que usaba los tipos anteriores:**

1. **Api.access_policy_id → Api.access_policy** (ahora es enum)
2. **Api.authentication_method_id → Api.auth_method** (ahora es enum)
3. **Campos nuevos** pueden requerir ajustes en formularios
4. **Platform** perdió `vendor_id`, `version`, `url`
5. **Algunos campos** que eran opcionales ahora son nullable

**Migración recomendada:**

```typescript
// Antes
const api = {
    access_policy_id: 1,
    authentication_method_id: 2,
};

// Ahora
const api = {
    access_policy: AccessPolicy.PUBLIC,
    auth_method: AuthorizationMethod.OAUTH,
};
```

## 📅 Próximos Pasos

1. ✅ **Actualizar módulos API** en `lib/api/`
2. ✅ **Crear componentes UI** para nuevas entidades
3. ✅ **Implementar páginas** de catálogo
4. ✅ **Escribir tests** para validaciones
5. ✅ **Actualizar documentación** de API
6. ✅ **Migrar código existente** a nuevos tipos

---

**Fecha de actualización**: 2 de noviembre de 2025  
**Archivo de respaldo**: `frontend/types/api-old.ts`  
**Archivo actualizado**: `frontend/types/api.ts`
