# Backend implementation plan for Atlas Catalog

Fecha: March 7, 2026

Branch: `analysis/backend-implementation-plan`

Objetivo: cerrar el trabajo restante del backend Laravel desde el estado real
del repositorio, no desde la fotografía inicial del 4 de marzo.

## Summary

El backend ya no está en fase de arranque. El repositorio ya incorpora rutas
corregidas, separación básica de webhooks, autenticación con Sanctum, RBAC por
roles, rate limiting, seeders de ejemplo y una base amplia de feature tests.

El plan actualizado se centra en cuatro bloques restantes.

1. Normalizar la ingestión de deployments y endurecer su validación.
2. Completar la consistencia horizontal de la API.
3. Cerrar la documentación ejecutable con Scramble y documentos auxiliares.
4. Dejar caché y eventos como mejoras opcionales posteriores.

## Current status

La tabla siguiente resume el estado verificado contra el código actual.

| Área                  | Estado verificado                                                                                                                   | Lectura operativa |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Rutas críticas        | `entities/{entity}/components`, `apis/access-policies/{id}/apis`, `frameworks/{framework}/components` y deployments ya tienen rutas | Resuelto          |
| Webhooks              | Existe `routes/v1/webhooks.php`, middleware `VerifyWebhookToken` y throttling dedicado                                              | Resuelto          |
| Auth API              | Sanctum, guard `sanctum` y endpoints `login`, `register`, `me`, `logout` existen                                                    | Resuelto          |
| RBAC                  | Hay migraciones de `roles`, modelo `Role`, helpers en `User` y policies con reglas por rol                                          | Resuelto          |
| Rate limiting         | Los limitadores `api` y `webhooks` están registrados                                                                                | Resuelto          |
| Feature tests         | Existe `ApiTestCase` y 43 archivos de feature tests                                                                                 | Muy avanzado      |
| Search, filter y sort | Los traits y tests unitarios existen, pero no están en todos los controllers de listado                                             | Parcial           |
| Seeders               | Existen seeders base y `database/seeders/examples/` con 9 seeders de ejemplo                                                        | Muy avanzado      |
| Scramble y OpenAPI    | Scramble está configurado, pero la cobertura documental no está validada de extremo a extremo                                       | Parcial           |
| Caché y eventos       | No hay implementación transversal cerrada                                                                                           | Pendiente         |

## Open gaps

Estos son los huecos reales que aún justifican trabajo.

| Prioridad | Gap                                                                                                              | Impacto                                   |
| --------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Alta      | El contrato del webhook de deployments no coincide con el CRUD principal                                         | Riesgo de inconsistencias de datos        |
| Alta      | No existe validación por JSON Schema para payloads de CI/CD                                                      | Fragilidad frente a cambios del proveedor |
| Media     | `filter`, `search` y `sort` no cubren todos los listados                                                         | Inconsistencia funcional entre endpoints  |
| Media     | La cobertura de feature tests aún no es uniforme en endpoints secundarios                                        | Menor confianza de regresión              |
| Media     | `src/README.md` y otra documentación secundaria siguen describiendo capacidades ya implementadas como pendientes | Documentación desalineada                 |
| Baja      | No existe una `service layer` consolidada para deployments                                                       | Mantenimiento más difícil                 |
| Baja      | Caché y eventos recientes siguen sin diseño cerrado                                                              | Escalabilidad y extensibilidad pendientes |

## Phase A: deployment ingestion

Esta es la fase prioritaria. Concentra el principal desajuste funcional que
queda en el backend.

### A.1 Normalizar el contrato de deployments

Objetivo: unificar naming, estados y forma de persistencia entre el webhook y
el controller principal.

Entregables:

- Alinear `finished_at` frente a `ended_at`.
- Alinear `metadata` frente a `meta`.
- Unificar catálogo de estados del deployment.
- Definir una única estrategia para duración y timestamps.

Estimación: 2 horas.

### A.2 Añadir validación por JSON Schema

Objetivo: validar payloads de CI/CD con un esquema versionable y menos frágil
que un conjunto fijo de reglas de Laravel.

Entregables:

- Definir un esquema para el webhook de deployments.
- Integrar la validación en la entrada del webhook.
- Cubrir errores de schema en tests de integración.

Estimación: 2 horas.

### A.3 Extraer un `DeploymentService`

Objetivo: concentrar la normalización del payload, la creación o actualización
del deployment y la lógica de timestamps.

Entregables:

- Crear una capa de servicio para deployments.
- Quitar lógica duplicada de controllers.
- Dejar al webhook y al CRUD usando la misma lógica de negocio.

Estimación: 2 horas.

### A.4 Ampliar tests de integración de webhook

Objetivo: cubrir casos felices, contratos inválidos, actualización idempotente
y mapping de estados.

Estimación: 2 horas.

Total fase A: ~8 horas.

## Phase B: API consistency and coverage

La base técnica ya existe. Aquí el trabajo consiste en cerrar huecos.

### B.1 Extender `filter`, `search` y `sort`

Objetivo: aplicar el patrón ya existente a los controllers de listado que aún
no lo usan.

Estimación: 3 horas.

### B.2 Completar feature tests faltantes

Objetivo: cubrir endpoints secundarios, controllers de lookup pendientes y
casos de error donde la cobertura aún no es uniforme.

Estimación: 4 horas.

### B.3 Revisar `authorize()` y validación residual

Objetivo: detectar Form Requests o endpoints donde las reglas de autorización
o validación fina todavía no reflejan el RBAC ya implementado.

Estimación: 2 horas.

Total fase B: ~9 horas.

## Phase C: executable documentation

La documentación ya tiene una base sólida en Scramble. Lo que falta es
confirmarla como fuente de verdad y limpiar contradicciones documentales.

### C.1 Validar la cobertura de Scramble

Objetivo: comprobar que todos los endpoints actuales aparecen con parámetros,
relaciones y respuestas razonables.

Estimación: 2 horas.

### C.2 Ajustar PHPDoc y anotaciones

Objetivo: mejorar ejemplos, parámetros y descripciones donde Scramble todavía
no genere una especificación suficientemente clara.

Estimación: 2 horas.

### C.3 Actualizar documentación secundaria

Objetivo: alinear `src/README.md` y otros documentos auxiliares con el estado
real del backend.

Estimación: 1 hora.

Total fase C: ~5 horas.

## Phase D: optional architecture improvements

Este bloque no bloquea la estabilización. Conviene abordarlo solo después de
cerrar las fases A, B y C.

### D.1 Caché de respuestas de lectura

Objetivo: introducir caché con Redis o Valkey en endpoints intensivos de
lectura y definir su invalidación.

Estimación: 6 horas.

### D.2 Sistema de eventos recientes

Objetivo: diseñar una vista o modelo transversal para exponer actividad
reciente de deployments, builds y actualizaciones relevantes.

Estimación: 6 horas.

### D.3 Patrón webhook multi-provider

Objetivo: abstraer el webhook actual para soportar más de un proveedor de CI
sin mezclar contratos en controllers de dominio.

Estimación: 4 horas.

Total fase D: ~16 horas.

## Remaining effort

| Bloque                               | Horas estimadas |
| ------------------------------------ | --------------- |
| Phase A                              | ~8h             |
| Phase B                              | ~9h             |
| Phase C                              | ~5h             |
| Phase D                              | ~16h            |
| Backlog prioritario real             | ~22h            |
| Backlog total con mejoras opcionales | ~38h            |

La estimación histórica de ~96 horas ya no representa el trabajo restante.
Desde el estado real del repositorio, el backlog prioritario está más cerca de
22 horas.

## Recommended execution order

El orden recomendado para aterrizar el backend es el siguiente.

1. Cerrar la fase A para eliminar la mayor fuente de inconsistencia funcional.
2. Ejecutar la fase B para uniformar comportamiento y confianza de la API.
3. Ejecutar la fase C para consolidar a Scramble y la documentación como
   reflejo fiel del backend.
4. Mover la fase D a una iteración posterior, salvo que aparezca una necesidad
   explícita de rendimiento o trazabilidad.

## Key files

| Archivo                                                             | Propósito                                 |
| ------------------------------------------------------------------- | ----------------------------------------- |
| `src/routes/api.php`                                                | Punto de entrada de rutas API             |
| `src/routes/v1/webhooks.php`                                        | Rutas de ingesta externas                 |
| `src/routes/v1/ci-cd.php`                                           | Rutas de deployments y CI/CD              |
| `src/app/Http/Controllers/DeploymentController.php`                 | CRUD principal de deployments             |
| `src/app/Http/Controllers/Webhooks/DeploymentWebhookController.php` | Ingesta actual de deployments vía webhook |
| `src/app/Providers/AppServiceProvider.php`                          | Rate limiting y wiring de aplicación      |
| `src/config/auth.php`                                               | Guards y configuración auth               |
| `src/config/scramble.php`                                           | Configuración de documentación OpenAPI    |
| `src/tests/Feature/ApiTestCase.php`                                 | Base para tests de API                    |
| `src/database/seeders/examples/`                                    | Seeders de datos de ejemplo               |
| `src/README.md`                                                     | Documento aún pendiente de alineación     |

## Dependencies

| Paquete o dependencia | Estado                         | Uso                                            |
| --------------------- | ------------------------------ | ---------------------------------------------- |
| `laravel/sanctum`     | Instalado                      | Autenticación API por tokens                   |
| `dedoc/scramble`      | Instalado                      | Generación y visualización de OpenAPI          |
| `opis/json-schema`    | Disponible de forma transitiva | Candidato para validación robusta de webhooks  |
| `dedoc/scramble-pro`  | Opcional                       | Solo evaluar si Scramble actual se queda corto |
| `valkey/valkey`       | Pendiente                      | Capa de caché opcional                         |

## Definition of done for the next milestone

El próximo hito del backend debe considerarse cerrado cuando se cumplan estos
criterios.

1. El webhook y el CRUD de deployments compartan contrato y lógica de negocio.
2. Los payloads de CI/CD se validen con schema versionable.
3. Los endpoints prioritarios tengan `filter`, `search` y `sort` consistentes.
4. Los tests de integración cubran los casos críticos restantes.
5. Scramble y `src/README.md` describan correctamente el estado actual.

Revalidado contra el repositorio el March 7, 2026.

## Progress log

### 7 de marzo de 2026

**Completado:**

- ✅ `DeploymentWebhookControllerTest` — 15 tests, 43 assertions
- ✅ `DeploymentRouteTest` — 11 tests, 45 assertions
- ✅ `ReleaseControllerTest` — 9 tests, 55 assertions
  - Bug corregido: `ReleaseController::update()` devolvía el booleano de `$release->update()` en lugar del modelo actualizado.
  - Test reescrito para reflejar el contrato real (`component_id`, `status`).
- ✅ `WorkflowRunControllerTest` — 9 tests, 95 assertions
  - Bug corregido: `WorkflowRunResult::values()` no tenía implementación concreta (solo PHPDoc).
  - Bug corregido: cast incorrecto `'status'` → `'result'` en el modelo `WorkflowRun`.
  - Bug corregido: binding `$workflowRun` → `$run` para coincidir con el parámetro de ruta `{run}`.
  - Creado `WorkflowRunResource` (el modelo carecía de `#[UseResource]`).
  - Validación alineada con el schema: `description` es `NOT NULL` en la tabla.
- ✅ `WorkflowJobControllerTest` — 9 tests, 60 assertions
  - Bug corregido: `DiscoverySource::values()` no tenía implementación concreta (solo PHPDoc).
  - Bug corregido: `WorkflowJobController` usaba `->toResource()` sin `#[UseResource]` en el modelo.
  - Bug corregido: binding `$workflowJob` renombrado a `$job` para coincidir con `{job}`; añadido parámetro `string $workflow` para absorber el binding padre `{workflow}` del recurso anidado.
  - Creado `WorkflowJobResource`.

- ✅ `WorkflowRunCommitControllerTest` — 7 tests, 38 assertions
  - Bug corregido: `WorkflowRunCommitFactory` usaba `$this->faker->sha256` (64 chars) pero la columna `commit_sha` es `varchar(40)` (longitud SHA-1). Corregido a `$this->faker->sha1`.
  - Solo rutas `index` y `show` registradas (read-only); ambas funcionan sin cambios en el controller.

**Total CI/CD:** 51 tests, 344 assertions — todos verdes.

