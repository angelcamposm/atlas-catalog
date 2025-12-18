# API Dependencies Feature

## Descripción

Esta funcionalidad permite visualizar las relaciones entre APIs y Componentes del catálogo. 
Muestra qué componentes consumen (usan) o proveen (exponen) cada API.

## Estado Actual

✅ **Frontend**: Infraestructura preparada con componentes y tipos  
⏳ **Backend**: Pendiente implementar endpoints REST

## Arquitectura Frontend

### Módulos

```
frontend/lib/api/api-dependencies.ts    # API client, tipos, schemas Zod
frontend/components/apis/
├── ApiDependenciesTab.tsx              # Tab para SlideOver panel
└── ApiDetail/ApiDependencies.tsx       # Sección para página de detalle
```

### Tipos Principales

```typescript
// Tipos de relación soportados
type ApiRelationshipType =
    | "uses"        // Componente usa esta API
    | "provides"    // Componente provee/expone esta API
    | "consumes"    // Componente consume esta API
    | "implements"  // Componente implementa esta especificación API
    | "depends_on"  // Componente depende de esta API
    | "owns";       // Componente gestiona/es dueño de esta API

// Estructura de respuesta esperada
interface ApiDependencies {
    api_id: number;
    consumers: ApiRelation[];      // Componentes que consumen
    providers: ApiRelation[];      // Componentes que proveen
    total_consumers: number;
    total_providers: number;
}

interface ApiRelation {
    id: number;
    component: DependencyComponent;
    relationship: ApiRelationshipType;
    created_at?: string;
    updated_at?: string;
}
```

## Endpoints Backend Requeridos

### 1. Obtener dependencias de una API

```
GET /api/v1/apis/{id}/dependencies
```

**Response esperado:**
```json
{
    "api_id": 1,
    "consumers": [
        {
            "id": 1,
            "component": {
                "id": 10,
                "name": "user-service",
                "display_name": "User Service",
                "slug": "user-service",
                "description": "Servicio de usuarios"
            },
            "relationship": "uses",
            "created_at": "2025-01-01T00:00:00Z"
        }
    ],
    "providers": [
        {
            "id": 2,
            "component": {
                "id": 5,
                "name": "api-gateway",
                "display_name": "API Gateway",
                "slug": "api-gateway"
            },
            "relationship": "provides"
        }
    ],
    "total_consumers": 1,
    "total_providers": 1
}
```

### 2. Obtener solo consumidores

```
GET /api/v1/apis/{id}/consumers
```

**Response:**
```json
{
    "data": [
        {
            "id": 1,
            "component": { ... },
            "relationship": "uses"
        }
    ]
}
```

### 3. Obtener solo proveedores

```
GET /api/v1/apis/{id}/providers
```

**Response:**
```json
{
    "data": [
        {
            "id": 2,
            "component": { ... },
            "relationship": "provides"
        }
    ]
}
```

### 4. Obtener APIs de un componente

```
GET /api/v1/components/{id}/apis
```

**Response:**
```json
{
    "data": [
        {
            "id": 1,
            "api": {
                "id": 5,
                "name": "payments-api",
                "display_name": "Payments API",
                "version": "v1"
            },
            "relationship": "uses"
        }
    ]
}
```

### 5. Crear relación (opcional)

```
POST /api/v1/apis/{id}/components
```

**Request:**
```json
{
    "component_id": 10,
    "relationship": "uses"
}
```

### 6. Eliminar relación (opcional)

```
DELETE /api/v1/apis/{id}/components/{componentId}
```

## Schema de Base de Datos

La tabla `component_apis` ya existe con el siguiente schema:

```sql
CREATE TABLE component_apis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    component_id BIGINT NOT NULL,
    api_id BIGINT NOT NULL,
    relationship VARCHAR(50) DEFAULT 'uses',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
    FOREIGN KEY (api_id) REFERENCES apis(id) ON DELETE CASCADE,
    UNIQUE KEY unique_component_api (component_id, api_id)
);
```

## Implementación Backend Sugerida

### Controller (Laravel)

```php
<?php

namespace App\Http\Controllers;

use App\Models\Api;
use App\Http\Resources\ApiDependenciesResource;

class ApiDependenciesController extends Controller
{
    public function index(Api $api)
    {
        $consumers = $api->componentApis()
            ->where('relationship', 'uses')
            ->orWhere('relationship', 'consumes')
            ->with('component')
            ->get();
            
        $providers = $api->componentApis()
            ->where('relationship', 'provides')
            ->orWhere('relationship', 'owns')
            ->with('component')
            ->get();

        return response()->json([
            'api_id' => $api->id,
            'consumers' => ApiRelationResource::collection($consumers),
            'providers' => ApiRelationResource::collection($providers),
            'total_consumers' => $consumers->count(),
            'total_providers' => $providers->count(),
        ]);
    }
}
```

### Rutas

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::get('apis/{api}/dependencies', [ApiDependenciesController::class, 'index']);
    Route::get('apis/{api}/consumers', [ApiDependenciesController::class, 'consumers']);
    Route::get('apis/{api}/providers', [ApiDependenciesController::class, 'providers']);
    Route::get('components/{component}/apis', [ComponentApisController::class, 'index']);
});
```

## Uso en Frontend

### Importar el módulo

```typescript
import { 
    apiDependenciesApi,
    getRelationshipLabel,
    getRelationshipColor 
} from "@/lib/api";
```

### Obtener dependencias

```typescript
const dependencies = await apiDependenciesApi.getDependencies(apiId);

console.log(dependencies.consumers);  // Componentes que consumen
console.log(dependencies.providers);  // Componentes que proveen
```

### Usar utilidades de display

```typescript
const label = getRelationshipLabel("uses");      // "Usa"
const color = getRelationshipColor("provides");  // "bg-green-100 ..."
```

## Componentes UI

### ApiDependenciesTab

Para usar en SlideOver panels:

```tsx
import { ApiDependenciesTab } from "@/components/apis";

<ApiDependenciesTab apiId={api.id} locale="es" />
```

### ApiDependencies (página completa)

Para usar en páginas de detalle:

```tsx
import { ApiDependencies } from "@/components/apis";

<ApiDependencies 
    api={api}
    componentApis={componentApis}
    components={components}
    locale="es"
/>
```

## Próximos Pasos

1. [ ] Implementar endpoints en el backend Laravel
2. [ ] Agregar tests para los nuevos endpoints
3. [ ] Descomentar llamadas reales en `api-dependencies.ts`
4. [ ] Agregar formulario para crear/editar relaciones
5. [ ] Implementar visualización de grafo de dependencias

## Contacto

Para preguntas sobre la implementación del backend, revisar el schema de la tabla `component_apis` en:
`src/database/migrations/2025_11_23_094321_create_component_apis_table.php`
