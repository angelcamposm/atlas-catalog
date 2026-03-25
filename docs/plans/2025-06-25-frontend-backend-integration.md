# Frontend ↔ Backend Full Integration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Conectar completamente el frontend Next.js con todos los endpoints del backend Laravel, incluyendo autenticación, autorización por roles, los 9 dominios API, y cobertura total con Playwright E2E tests.

**Architecture:** SPA Next.js que consume una API REST Laravel vía proxy (`/api/v1/*` → `localhost:8080`). Autenticación por Bearer Token (Sanctum). Cada dominio backend tiene su módulo API frontend (`lib/api/*.ts`), sus tipos Zod (`types/api.ts`), páginas bajo `app/[locale]/(protected)/`, y tests E2E con Playwright. El patrón se repite: API module → Types → Page → Components → Playwright tests.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Zod 4, Playwright 1.57, Jest 30, next-intl 4, Radix UI, Recharts, @xyflow/react, swagger-ui-react

---

## Tabla de Contenidos

1. [Gap Analysis](#gap-analysis)
2. [Prerrequisitos: Auth & API Client](#fase-0-prerrequisitos-auth--api-client)
3. [Fase 1: Catalog Domain](#fase-1-catalog-domain)
4. [Fase 2: Architecture Domain](#fase-2-architecture-domain)
5. [Fase 3: Infrastructure Domain](#fase-3-infrastructure-domain)
6. [Fase 4: Organization Domain](#fase-4-organization-domain)
7. [Fase 5: Security Domain](#fase-5-security-domain)
8. [Fase 6: Compliance Domain](#fase-6-compliance-domain)
9. [Fase 7: Operations Domain](#fase-7-operations-domain)
10. [Fase 8: CI/CD Domain](#fase-8-cicd-domain)
11. [Fase 9: Dashboard & Search](#fase-9-dashboard--search)
12. [Fase 10: Admin & Taxonomías](#fase-10-admin--taxonomías)
13. [Fase 11: Playwright E2E Test Suite](#fase-11-playwright-e2e-test-suite)
14. [Apéndice: Endpoint Map Completo](#apéndice-endpoint-map-completo)

---

## Gap Analysis

### Estado Actual del Frontend

| Módulo | API Client | Types | Pages | Components | Unit Tests | E2E Tests | Estado |
|--------|-----------|-------|-------|------------|------------|-----------|--------|
| Auth (login/register/me/logout) | ❌ Parcial | ❌ | ✅ login page | ❌ | ❌ | ✅ login.spec.ts | ~20% |
| APIs (CRUD + types/categories/access-policies) | ✅ apis.ts, api-extended.ts, api-types.ts | ✅ | ✅ list/detail/new | ✅ 8 componentes | ✅ 8 unit tests | ✅ 2 specs | ~85% |
| Components (CRUD + types) | ✅ components.ts | ✅ | ✅ list/detail | ✅ ComponentDetail | ✅ 1 unit test | ❌ | ~50% |
| Platforms (CRUD + components) | ✅ platform.ts | ✅ | ✅ list/detail | ✅ | ✅ platform-module | ✅ platforms.spec | ~70% |
| Environments | ✅ environments.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~30% |
| Frameworks | ✅ frameworks.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~30% |
| Links (+ categories) | ✅ integration.ts | ✅ | ✅ list | ✅ | ✅ integration-module | ✅ 2 specs | ~70% |
| Resources (+ categories) | ✅ resources.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~30% |
| Service Models | ✅ service-models.ts | ✅ | ❌ | ❌ | ❌ | ❌ | ~15% |
| Programming Languages | ✅ programming-languages.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~30% |
| Clusters (+ types/nodes/SAs) | ✅ infrastructure.ts | ✅ | ✅ list/detail | ✅ 3 componentes | ✅ clusters-api, 3 unit | ✅ 4 specs | ~75% |
| Nodes | ✅ infrastructure.ts | ✅ | ✅ | ❌ | ❌ | ✅ nodes.spec | ~50% |
| Infra Types | ✅ infrastructure-types.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~30% |
| Vendors | ✅ technology.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~30% |
| Business Domains | ✅ business-domains.ts, business.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~30% |
| Business Tiers | ✅ business.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~25% |
| Business Capabilities | ✅ architecture.ts | ⚠️ Parcial | ✅ | ❌ | ❌ | ❌ | ~20% |
| Systems | ✅ architecture.ts | ⚠️ Parcial | ❌ | ❌ | ❌ | ❌ | ~10% |
| Entities (+ attributes) | ✅ architecture.ts | ⚠️ Parcial | ❌ | ❌ | ❌ | ❌ | ~10% |
| Lifecycles | ✅ lifecycles.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~30% |
| Groups (+ types/member-roles) | ✅ groups.ts | ✅ | ✅ teams | ✅ TeamsList | ❌ | ❌ | ~35% |
| Users | ❌ | ❌ | ✅ users page shell | ❌ | ❌ | ❌ | ~10% |
| Auth Methods | ✅ security.ts | ✅ | ✅ | ❌ | ✅ security-module | ❌ | ~35% |
| Service Accounts (+ tokens) | ✅ service-accounts.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~30% |
| Compliance Standards | ✅ compliance.ts | ✅ | ✅ | ❌ | ❌ | ❌ | ~25% |
| Compliance Requirements | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 0% |
| Service Statuses | ✅ compliance.ts | ✅ | ❌ | ❌ | ❌ | ❌ | ~15% |
| Metrics | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 0% |
| CI/CD (servers/runs/commits/jobs/releases/deployments) | ❌ | ❌ | ✅ ci-cd shell page | ❌ | ❌ | ❌ | ~5% |
| Webhooks (deployment) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 0% |
| Dashboard | ❌ | ❌ | ✅ shell page | ✅ parcial | ❌ | ❌ | ~15% |

### Nuevos endpoints backend SIN cobertura frontend

Estos endpoints son **completamente nuevos** del backend recién mergeado y necesitan módulos API, tipos, páginas y tests desde cero:

1. **CI/CD Domain** — `ci-cd/servers`, `ci-cd/workflows/runs`, `ci-cd/workflows/commits`, `ci-cd/workflows.jobs`, `ci-cd/releases`, `ci-cd/deployments`
2. **Operations Domain** — `operations/metrics` (NUEVO, service-statuses ya existe parcial)
3. **Compliance Requirements** — `compliance/compliance-requirements`
4. **Entity Attributes** — `architecture/entities.attributes`
5. **Business Capability Systems** — `architecture/business-capability-systems`, `architecture/business-capabilities/{id}/systems`
6. **Users CRUD** — `organization/users` (solo hay page shell)
7. **Webhooks** — `webhooks/deployments` (inbound, no necesita UI de usuario, solo config admin)
8. **Release Artifacts** — dentro de releases en CI/CD

---

## Fase 0: Prerrequisitos — Auth & API Client

### Task 0.1: Auth API Module

**Files:**
- Create: `frontend/lib/api/auth.ts`
- Modify: `frontend/lib/api/index.ts` (agregar export)
- Test: `frontend/__tests__/auth-module.test.ts`

**Step 1: Write the failing test**

```typescript
// frontend/__tests__/auth-module.test.ts
import { authApi } from '@/lib/api/auth';

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('authApi', () => {
  it('should export login function', () => {
    expect(authApi.login).toBeDefined();
  });
  it('should export register function', () => {
    expect(authApi.register).toBeDefined();
  });
  it('should export me function', () => {
    expect(authApi.me).toBeDefined();
  });
  it('should export logout function', () => {
    expect(authApi.logout).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend && pnpm test -- __tests__/auth-module.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// frontend/lib/api/auth.ts
import { apiClient } from '@/lib/api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/v1/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<LoginResponse>('/v1/auth/register', data),

  me: () =>
    apiClient.get<{ data: LoginResponse['user'] }>('/v1/auth/me'),

  logout: () =>
    apiClient.post<void>('/v1/auth/logout', {}),
};
```

**Step 4: Run test to verify it passes**

Run: `cd frontend && pnpm test -- __tests__/auth-module.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/lib/api/auth.ts frontend/__tests__/auth-module.test.ts
git commit -m "feat(auth): add auth API module with login/register/me/logout"
```

---

### Task 0.2: Auth Context / Token Management

**Files:**
- Create: `frontend/lib/auth-context.tsx`
- Create: `frontend/hooks/useAuth.ts`
- Test: `frontend/__tests__/auth-context.test.tsx`

**Step 1: Write the failing test**

```typescript
// frontend/__tests__/auth-context.test.tsx
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from '@/lib/auth-context';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/lib/api/auth', () => ({
  authApi: {
    login: jest.fn().mockResolvedValue({ token: 'test-token', user: { id: 1, name: 'Test', email: 'test@test.com', role: 'admin' } }),
    me: jest.fn().mockResolvedValue({ data: { id: 1, name: 'Test', email: 'test@test.com', role: 'admin' } }),
    logout: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('useAuth', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login sets user and token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'pass' });
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('test@test.com');
  });
});
```

**Step 2:** Run test → FAIL

**Step 3:** Implement AuthProvider context con token en localStorage, useAuth hook que expone `{ user, isAuthenticated, login, logout, loading }`.

**Step 4:** Run test → PASS

**Step 5: Commit**

```bash
git commit -m "feat(auth): add AuthProvider context and useAuth hook"
```

---

### Task 0.3: API Client — Inyectar Bearer Token automáticamente

**Files:**
- Modify: `frontend/lib/api-client.ts` — agregar interceptor que lee token de localStorage y agrega `Authorization: Bearer {token}` header.
- Test: `frontend/__tests__/api-client.test.ts` — agregar tests para token injection.

**Step 1:** Agregar test que verifica que si hay token en localStorage, `apiClient.get()` agrega header Authorization.

**Step 2:** Run → FAIL

**Step 3:** Modificar `apiClient` para leer token de localStorage e inyectarlo en headers.

**Step 4:** Run → PASS

**Step 5: Commit**

```bash
git commit -m "feat(api-client): inject Bearer token from localStorage"
```

---

### Task 0.4: Middleware de protección de rutas

**Files:**
- Modify: `frontend/middleware.ts` — verificar que rutas `/(protected)/*` redirigen a `/login` si no hay token.
- Test: `frontend/e2e/auth/protected-routes.spec.ts`

**Step 1: Write the E2E test**

```typescript
// frontend/e2e/auth/protected-routes.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/en/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });

  test('allows access when authenticated', async ({ page }) => {
    // Login first
    await page.goto('/en/login');
    await page.fill('[name="email"]', 'admin@atlas.test');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
```

**Step 2:** Run → FAIL

**Step 3:** Implementar lógica en middleware.ts

**Step 4:** Run → PASS

**Step 5: Commit**

```bash
git commit -m "feat(auth): add route protection middleware with E2E tests"
```

---

## Fase 1: Catalog Domain

> Backend: `src/routes/v1/catalog.php` — 270 líneas, ~30 endpoints
> Frontend existente: APIs (~85%), Components (~50%), Platforms (~70%), Links (~70%), parcial para el resto

### Task 1.1: Verificar y actualizar rutas API del Catalog Domain

**Files:**
- Verify: `frontend/lib/api/apis.ts` — debe usar `/v1/catalog/apis` (no `/v1/apis`)
- Verify: `frontend/lib/api/api-extended.ts` — `/v1/catalog/apis/types`, `/v1/catalog/apis/categories`, `/v1/catalog/apis/access-policies`
- Verify: `frontend/lib/api/api-types.ts` — `/v1/catalog/apis/types`
- Verify: `frontend/lib/api/components.ts` — `/v1/catalog/components`
- Verify: `frontend/lib/api/platform.ts` — `/v1/catalog/platforms`, `/v1/catalog/components/types`
- Verify: `frontend/lib/api/integration.ts` — `/v1/catalog/links`, `/v1/catalog/links/categories`
- Verify: `frontend/lib/api/resources.ts` — `/v1/catalog/resources`, `/v1/catalog/resources/categories`
- Verify: `frontend/lib/api/frameworks.ts` — `/v1/catalog/frameworks`
- Verify: `frontend/lib/api/environments.ts` — `/v1/catalog/environments`
- Verify: `frontend/lib/api/programming-languages.ts` — `/v1/catalog/programming-languages`
- Verify: `frontend/lib/api/service-models.ts` — `/v1/catalog/service-models`
- Test: `frontend/__tests__/catalog-routes.test.ts`

**Step 1:** Crear un test que importa cada módulo API y verifica que las URLs base son las correctas del dominio `catalog/`. Comparar con doc `FRONTEND_BACKEND_SYNC_PLAN.md`.

**Step 2:** Run → verificar qué endpoints ya están actualizados (según sync plan, ya se migraron) y cuáles no.

**Step 3:** Corregir cualquier URL que quede con patrón antiguo (`/v1/apis` en vez de `/v1/catalog/apis`).

**Step 4:** Run → PASS

**Step 5: Commit**

```bash
git commit -m "fix(api): verify and fix all catalog domain API routes"
```

---

### Task 1.2: Agregar endpoints faltantes en APIs module

**Files:**
- Modify: `frontend/lib/api/apis.ts` — agregar `getComponents(apiId)` → `GET /v1/catalog/apis/{api}/components`
- Modify: `frontend/lib/api/api-extended.ts` — agregar `getAccessPolicyApis(policyId)` → `GET /v1/catalog/apis/access-policies/{id}/apis`
- Test: `frontend/__tests__/apis-module.test.ts` — agregar tests para nuevos métodos

**Step 1:** Test para `apisApi.getComponents(1)` y `apiAccessPoliciesApi.getApis('public')`.

**Step 2–5:** TDD cycle + commit.

```bash
git commit -m "feat(catalog): add missing API endpoints for components and access-policy apis"
```

---

### Task 1.3: Agregar endpoints faltantes — Platform components, Framework components

**Files:**
- Modify: `frontend/lib/api/platform.ts` — agregar `getPlatformComponents(platformId)` → `GET /v1/catalog/platforms/{platform}/components`
- Modify: `frontend/lib/api/frameworks.ts` — agregar `getFrameworkComponents(frameworkId)` → `GET /v1/catalog/frameworks/{framework}/components`
- Test: agregar tests en módulos correspondientes

**Step 1–5:** TDD cycle + commit.

```bash
git commit -m "feat(catalog): add platform and framework component endpoints"
```

---

### Task 1.4: Service Models — Pages y Componentes

**Files:**
- Create: `frontend/app/[locale]/(protected)/catalog/service-models/page.tsx`
- Create: `frontend/app/[locale]/(protected)/catalog/service-models/[id]/page.tsx`
- Create: `frontend/components/catalog/ServiceModelList.tsx`
- Create: `frontend/components/catalog/ServiceModelDetail.tsx`
- Test: `frontend/__tests__/components/catalog/ServiceModelList.test.tsx`
- E2E: `frontend/e2e/catalog/service-models.spec.ts`

**Step 1:** Write unit test for ServiceModelList rendering con mock data.

**Step 2:** Run → FAIL

**Step 3:** Implementar ServiceModelList con tabla, search, pagination (patrón igual a otros módulos existentes como Links).

**Step 4:** Run → PASS

**Step 5:** Commit, luego repetir para ServiceModelDetail y page.tsx.

```bash
git commit -m "feat(catalog): add service models list page and components"
```

---

### Task 1.5: Completar Environments — Page con componentes

**Files:**
- Modify: `frontend/app/[locale]/(protected)/infrastructure/environments/page.tsx` — conectar con `environmentsApi`
- Create: `frontend/components/infrastructure/EnvironmentList.tsx`
- Test: `frontend/__tests__/components/infrastructure/EnvironmentList.test.tsx`

Mismos pasos TDD. Nota: el backend tiene environments en DOS dominios:
- `GET /v1/catalog/environments` (público, lista general)
- `GET /v1/infrastructure/environments` (autenticado, CRUD completo)

Usar el de infrastructure para el CRUD admin.

```bash
git commit -m "feat(infrastructure): add environment list component and page"
```

---

### Task 1.6: Completar Resources — Páginas con CRUD

**Files:**
- Modify: `frontend/app/[locale]/(protected)/resources/page.tsx` — conectar con `resourcesApi`
- Create: `frontend/components/catalog/ResourceList.tsx`
- Create: `frontend/components/catalog/ResourceForm.tsx`
- Test: `frontend/__tests__/components/catalog/ResourceList.test.tsx`
- E2E: `frontend/e2e/catalog/resources.spec.ts`

```bash
git commit -m "feat(catalog): add resource CRUD pages and components"
```

---

### Task 1.7: Completar Frameworks — Páginas

**Files:**
- Modify: `frontend/app/[locale]/(protected)/technology/frameworks/page.tsx`
- Create: `frontend/components/technology/FrameworkList.tsx`
- Test + E2E pattern.

```bash
git commit -m "feat(technology): add framework list page and component"
```

---

### Task 1.8: Completar Programming Languages — Páginas

**Files:**
- Modify: `frontend/app/[locale]/(protected)/technology/languages/page.tsx`
- Create: `frontend/components/technology/LanguageList.tsx`
- Test + E2E pattern.

```bash
git commit -m "feat(technology): add programming languages page"
```

---

## Fase 2: Architecture Domain

> Backend: `src/routes/v1/architecture.php` — business-capabilities, business-capability-systems, business-domains, business-tiers, entities, entity-attributes, lifecycles, systems, infrastructure-types
> Frontend existente: architecture.ts API module parcial, business.ts, business-domains.ts, lifecycles.ts

### Task 2.1: Completar architecture.ts API module

**Files:**
- Modify: `frontend/lib/api/architecture.ts`
- Verificar que ya tiene: `businessCapabilitiesApi`, `entitiesApi`, `systemsApi`
- Agregar faltantes:
  - `getCapabilitySystems(capabilityId)` → `GET /v1/architecture/business-capabilities/{id}/systems`
  - `businessCapabilitySystemsApi.getAll()` → `GET /v1/architecture/business-capability-systems`
  - `entityAttributesApi` → CRUD `architecture/entities/{entity}/attributes`
  - `getEntityComponents(entityId)` → `GET /v1/architecture/entities/{id}/components`
  - `getSystemComponents(systemId)` → `GET /v1/architecture/systems/{id}/components`
  - `getLifecycleComponents(lifecycleId)` → `GET /v1/architecture/lifecycles/{id}/components`
  - `getDomainComponents(domainId)` → `GET /v1/architecture/business-domains/{id}/components`
  - `getDomainEntities(domainId)` → `GET /v1/architecture/business-domains/{id}/entities`
  - `infrastructureTypesApi` → CRUD `architecture/infrastructure-types`
- Test: `frontend/__tests__/architecture-module.test.ts`

**Step 1:** Test para cada nuevo endpoint.

**Step 2:** Run → FAIL

**Step 3:** Implementar en architecture.ts.

**Step 4:** Run → PASS

**Step 5: Commit**

```bash
git commit -m "feat(architecture): complete API module with all endpoints"
```

---

### Task 2.2: Zod Types — Business Capabilities, Systems, Entities, Entity Attributes

**Files:**
- Modify: `frontend/types/api.ts`
- Agregar/verificar schemas:
  - `businessCapabilitySchema` → `{ id, name, description, parent_id }`
  - `businessCapabilitySystemSchema` → `{ id, business_capability_id, system_id }`
  - `systemSchema` → `{ id, name, description }`
  - `entitySchema` → `{ id, name, description, is_enabled, domain_id }`
  - `entityAttributeSchema` → `{ id, entity_id, name, type, is_required }`
  - `infrastructureTypeSchema` → `{ id, name, description }`
- Test: `frontend/__tests__/api-schemas.test.ts` — agregar validaciones

```bash
git commit -m "feat(types): add Zod schemas for architecture domain entities"
```

---

### Task 2.3: Business Capabilities — Pages

**Files:**
- Create: `frontend/app/[locale]/(protected)/business/capabilities/page.tsx`
- Create: `frontend/app/[locale]/(protected)/business/capabilities/[id]/page.tsx`
- Create: `frontend/components/business/CapabilityList.tsx`
- Create: `frontend/components/business/CapabilityDetail.tsx` — mostrar systems asociados
- Test: `frontend/__tests__/components/business/CapabilityList.test.tsx`
- E2E: `frontend/e2e/business/capabilities.spec.ts`

El detalle debe mostrar:
- Info de la capability
- Árbol jerárquico (parent_id → tree)
- Systems asociados (`getCapabilitySystems`)

```bash
git commit -m "feat(business): add business capabilities pages with hierarchy"
```

---

### Task 2.4: Systems — Pages

**Files:**
- Create: `frontend/app/[locale]/(protected)/architecture/systems/page.tsx`
- Create: `frontend/app/[locale]/(protected)/architecture/systems/[id]/page.tsx`
- Create: `frontend/components/architecture/SystemList.tsx`
- Create: `frontend/components/architecture/SystemDetail.tsx` — mostrar components asociados
- Test + E2E

```bash
git commit -m "feat(architecture): add systems pages and components"
```

---

### Task 2.5: Entities — Pages con Attributes

**Files:**
- Create: `frontend/app/[locale]/(protected)/architecture/entities/page.tsx`
- Create: `frontend/app/[locale]/(protected)/architecture/entities/[id]/page.tsx`
- Create: `frontend/components/architecture/EntityList.tsx`
- Create: `frontend/components/architecture/EntityDetail.tsx` — con tabs: Overview, Attributes, Components
- Create: `frontend/components/architecture/EntityAttributeTable.tsx`
- Test + E2E

El detalle de entity debe:
- Mostrar info básica
- Tab "Attributes" → CRUD inline de `entity.attributes`
- Tab "Components" → componentes asociados via `getEntityComponents`

```bash
git commit -m "feat(architecture): add entity pages with attribute management"
```

---

### Task 2.6: Completar Business Domains — Páginas con componentes y entities

**Files:**
- Modify: `frontend/app/[locale]/(protected)/business/domains/[id]/page.tsx`
- Agregar tabs: Overview, Components, Entities
- Usar `getDomainComponents`, `getDomainEntities`
- Test + E2E

```bash
git commit -m "feat(business): enhance domain detail with components and entities tabs"
```

---

### Task 2.7: Completar Lifecycles  — Detalle con componentes

**Files:**
- Modify: `frontend/app/[locale]/(protected)/lifecycles/[id]/page.tsx`
- Agregar tab "Components" → `getLifecycleComponents`
- Test + E2E

```bash
git commit -m "feat(lifecycles): add components tab to lifecycle detail"
```

---

## Fase 3: Infrastructure Domain

> Backend: `src/routes/v1/infrastructure.php` — clusters, cluster-types, nodes, environments, infrastructure-types, vendors
> Frontend existente: infrastructure.ts (~75%), 4 E2E specs, 3 unit tests para clusters

### Task 3.1: Verificar rutas infrastructure API module

**Files:**
- Verify: `frontend/lib/api/infrastructure.ts` — todas las rutas deben usar `/v1/infrastructure/...`
- Agregar faltantes:
  - `getClusterNodes(clusterId)` → `GET /v1/infrastructure/clusters/{id}/nodes` (verificar si existe)
  - `getClusterServiceAccounts(clusterId)` → `GET /v1/infrastructure/clusters/{id}/service-accounts`
  - `infrastructureTypesApi` → CRUD `/v1/infrastructure/infrastructure-types`
  - `vendorsApi` → CRUD `/v1/infrastructure/vendors`
- Test: ampliar `frontend/__tests__/clusters-api.test.ts`

```bash
git commit -m "fix(infrastructure): verify and complete all API routes"
```

---

### Task 3.2: Cluster Detail — Mejorar con ServiceAccounts tab

**Files:**
- Modify: `frontend/components/infrastructure/ClusterDetail.tsx` (si existe) o crear
- Agregar tab "Service Accounts" usando `getClusterServiceAccounts`
- Test: `frontend/__tests__/components/ClusterDetailSlideOver.test.tsx` — ampliar

```bash
git commit -m "feat(infrastructure): add service accounts tab to cluster detail"
```

---

### Task 3.3: Infrastructure Types — Page CRUD

**Files:**
- Create: `frontend/app/[locale]/(protected)/infrastructure/types/page.tsx`
- Create: `frontend/components/infrastructure/InfraTypeList.tsx`
- Test + E2E

```bash
git commit -m "feat(infrastructure): add infrastructure types CRUD page"
```

---

### Task 3.4: Vendors — Page CRUD

**Files:**
- Modify: `frontend/app/[locale]/(protected)/technology/vendors/page.tsx` — conectar con API `/v1/infrastructure/vendors`
- Create: `frontend/components/technology/VendorList.tsx`
- Test + E2E

Nota: Vendors está en el dominio infrastructure del backend pero se muestra en Technology en el menú del frontend.

```bash
git commit -m "feat(technology): add vendors CRUD page"
```

---

## Fase 4: Organization Domain

> Backend: `src/routes/v1/organization.php` — groups (+ types + member-roles), users
> Frontend existente: groups.ts API module, teams page shell

### Task 4.1: Verificar rutas organization API module

**Files:**
- Verify: `frontend/lib/api/groups.ts` — debe usar `/v1/organization/groups`, `/v1/organization/groups/types`, `/v1/organization/groups/member-roles`
- Test: verificar en `frontend/__tests__/new-api-modules.test.ts` o crear nuevo

```bash
git commit -m "fix(organization): verify group API routes"
```

---

### Task 4.2: Users API Module

**Files:**
- Create: `frontend/lib/api/users.ts`
- Modify: `frontend/lib/api/index.ts` — agregar export
- Modify: `frontend/types/api.ts` — agregar `userSchema` si no existe
- Test: `frontend/__tests__/users-module.test.ts`

**Step 1: Write the test**

```typescript
// frontend/__tests__/users-module.test.ts
import { usersApi } from '@/lib/api/users';

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    del: jest.fn(),
  },
}));

describe('usersApi', () => {
  it('should have getAll', () => expect(usersApi.getAll).toBeDefined());
  it('should have getById', () => expect(usersApi.getById).toBeDefined());
  it('should have create', () => expect(usersApi.create).toBeDefined());
  it('should have update', () => expect(usersApi.update).toBeDefined());
  it('should have delete', () => expect(usersApi.delete).toBeDefined());
});
```

**Step 3: Implementation**

```typescript
// frontend/lib/api/users.ts
import { apiClient, buildQuery, PaginatedResponse } from '@/lib/api-client';
import type { User } from '@/types/api';

const BASE = '/v1/organization/users';

export const usersApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<User>>(`${BASE}${buildQuery(params)}`),
  getById: (id: number) =>
    apiClient.get<{ data: User }>(`${BASE}/${id}`),
  create: (data: Partial<User>) =>
    apiClient.post<{ data: User }>(BASE, data),
  update: (id: number, data: Partial<User>) =>
    apiClient.put<{ data: User }>(`${BASE}/${id}`, data),
  delete: (id: number) =>
    apiClient.del(`${BASE}/${id}`),
};
```

```bash
git commit -m "feat(organization): add users API module"
```

---

### Task 4.3: Users — Pages

**Files:**
- Modify: `frontend/app/[locale]/(protected)/users/page.tsx` — conectar con `usersApi`
- Create: `frontend/app/[locale]/(protected)/users/[id]/page.tsx`
- Create: `frontend/components/organization/UserList.tsx`
- Create: `frontend/components/organization/UserDetail.tsx`
- Test + E2E: `frontend/e2e/organization/users.spec.ts`

```bash
git commit -m "feat(organization): add user management pages"
```

---

### Task 4.4: Teams — Mejorar pages existentes

**Files:**
- Modify: `frontend/app/[locale]/(protected)/teams/page.tsx` — conectar con `groupsApi` real
- Modify: `frontend/app/[locale]/(protected)/teams/[id]/page.tsx` — tabs: Members, APIs owned, Settings
- Create: `frontend/components/teams/TeamDetail.tsx`
- Create: `frontend/components/teams/TeamMemberList.tsx`
- Test + E2E: `frontend/e2e/organization/teams.spec.ts`

```bash
git commit -m "feat(organization): enhance teams pages with member management"
```

---

### Task 4.5: Group Types & Member Roles — Admin CRUD

**Files:**
- Modify: `frontend/app/[locale]/(protected)/admin/group-types/page.tsx`
- Modify: `frontend/app/[locale]/(protected)/admin/member-roles/page.tsx`
- Usar componente `TaxonomyManager` genérico (ver Fase 10)
- Test + E2E

```bash
git commit -m "feat(admin): add group types and member roles management"
```

---

## Fase 5: Security Domain

> Backend: `src/routes/v1/security.php` — authentication-methods, service-accounts, service-accounts/tokens
> Frontend existente: security.ts, service-accounts.ts API modules

### Task 5.1: Verificar rutas security API

**Files:**
- Verify: `frontend/lib/api/security.ts` — `/v1/security/authentication-methods`
- Verify: `frontend/lib/api/service-accounts.ts` — `/v1/security/service-accounts`, `/v1/security/service-accounts/tokens`

```bash
git commit -m "fix(security): verify all security API routes"
```

---

### Task 5.2: Auth Methods — Page completa

**Files:**
- Modify: `frontend/app/[locale]/(protected)/security/auth-methods/page.tsx`
- Create: `frontend/components/security/AuthMethodList.tsx`
- Create: `frontend/components/security/AuthMethodForm.tsx`
- Test: `frontend/__tests__/components/security/AuthMethodList.test.tsx`
- E2E: `frontend/e2e/security/auth-methods.spec.ts`

```bash
git commit -m "feat(security): add auth methods CRUD page"
```

---

### Task 5.3: Service Accounts — Pages con tokens

**Files:**
- Modify: `frontend/app/[locale]/(protected)/organization/service-accounts/page.tsx`
- Create: `frontend/app/[locale]/(protected)/organization/service-accounts/[id]/page.tsx`
- Create: `frontend/components/security/ServiceAccountList.tsx`
- Create: `frontend/components/security/ServiceAccountDetail.tsx` — con tab "Tokens"
- Create: `frontend/components/security/TokenList.tsx`
- Test + E2E: `frontend/e2e/security/service-accounts.spec.ts`

El detalle debe mostrar:
- Info de la SA
- Lista de tokens con CRUD
- Botón "Generate Token" (el valor se muestra una sola vez)

```bash
git commit -m "feat(security): add service accounts pages with token management"
```

---

## Fase 6: Compliance Domain

> Backend: `src/routes/v1/compliance.php` — compliance-standards, compliance-requirements
> Frontend existente: compliance.ts (solo standards)

### Task 6.1: Agregar Compliance Requirements al API module

**Files:**
- Modify: `frontend/lib/api/compliance.ts` — agregar `complianceRequirementsApi` → CRUD `/v1/compliance/compliance-requirements`
- Modify: `frontend/types/api.ts` — agregar `complianceRequirementSchema`
- Test: `frontend/__tests__/compliance-module.test.ts`

```typescript
// Zod schema
export const complianceRequirementSchema = z.object({
  id: z.number().int(),
  compliance_standard_id: z.number().int(),
  name: z.string().trim().min(1),
  description: nullableString(),
  // ...timestamps, user reference
}).merge(timestampsSchema).merge(userReferenceSchema);
export type ComplianceRequirement = z.infer<typeof complianceRequirementSchema>;
```

```bash
git commit -m "feat(compliance): add compliance requirements API module and types"
```

---

### Task 6.2: Compliance Standards — Pages

**Files:**
- Modify: `frontend/app/[locale]/(protected)/security/compliance/page.tsx`
- Create: `frontend/app/[locale]/(protected)/security/compliance/[id]/page.tsx`
- Create: `frontend/components/compliance/ComplianceStandardList.tsx`
- Create: `frontend/components/compliance/ComplianceStandardDetail.tsx` — con Requirements tab
- Create: `frontend/components/compliance/RequirementTable.tsx`
- Test + E2E: `frontend/e2e/compliance/standards.spec.ts`

El detalle de standard debe:
- Mostrar info del standard
- Tab "Requirements" → lista de compliance-requirements con CRUD inline

```bash
git commit -m "feat(compliance): add compliance standards and requirements pages"
```

---

## Fase 7: Operations Domain

> Backend: `src/routes/v1/operations.php` — service-statuses, metrics
> Frontend existente: service-statuses en compliance.ts (parcial)

### Task 7.1: Refactorizar Service Statuses al Operations domain

**Files:**
- Modify: `frontend/lib/api/compliance.ts` → mover `serviceStatusesApi` a nuevo archivo
- Create: `frontend/lib/api/operations.ts` — `serviceStatusesApi` + `metricsApi`
- Modify: `frontend/types/api.ts` — agregar `metricSchema`
- Test: `frontend/__tests__/operations-module.test.ts`

```typescript
// frontend/lib/api/operations.ts
import { apiClient, buildQuery, PaginatedResponse } from '@/lib/api-client';

const OPS_BASE = '/v1/operations';

export const serviceStatusesApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<ServiceStatus>>(`${OPS_BASE}/service-statuses${buildQuery(params)}`),
  getById: (id: number) =>
    apiClient.get<{ data: ServiceStatus }>(`${OPS_BASE}/service-statuses/${id}`),
  create: (data: Partial<ServiceStatus>) =>
    apiClient.post<{ data: ServiceStatus }>(`${OPS_BASE}/service-statuses`, data),
  update: (id: number, data: Partial<ServiceStatus>) =>
    apiClient.put<{ data: ServiceStatus }>(`${OPS_BASE}/service-statuses/${id}`, data),
  delete: (id: number) =>
    apiClient.del(`${OPS_BASE}/service-statuses/${id}`),
};

export const metricsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Metric>>(`${OPS_BASE}/metrics${buildQuery(params)}`),
  getById: (id: number) =>
    apiClient.get<{ data: Metric }>(`${OPS_BASE}/metrics/${id}`),
  create: (data: Partial<Metric>) =>
    apiClient.post<{ data: Metric }>(`${OPS_BASE}/metrics`, data),
  update: (id: number, data: Partial<Metric>) =>
    apiClient.put<{ data: Metric }>(`${OPS_BASE}/metrics/${id}`, data),
  delete: (id: number) =>
    apiClient.del(`${OPS_BASE}/metrics/${id}`),
};
```

```bash
git commit -m "feat(operations): create operations API module with metrics"
```

---

### Task 7.2: Metrics — Pages

**Files:**
- Create: `frontend/app/[locale]/(protected)/operations/metrics/page.tsx`
- Create: `frontend/app/[locale]/(protected)/operations/metrics/[id]/page.tsx`
- Create: `frontend/components/operations/MetricList.tsx`
- Create: `frontend/components/operations/MetricDetail.tsx`
- Test + E2E: `frontend/e2e/operations/metrics.spec.ts`

```bash
git commit -m "feat(operations): add metrics CRUD pages"
```

---

## Fase 8: CI/CD Domain

> Backend: `src/routes/v1/ci-cd.php` — 100% NUEVO para frontend
> Endpoints: servers, workflows/runs, workflows/commits, workflows.jobs, releases, deployments

### Task 8.1: CI/CD API Module

**Files:**
- Create: `frontend/lib/api/ci-cd.ts`
- Modify: `frontend/lib/api/index.ts` — agregar export
- Test: `frontend/__tests__/ci-cd-module.test.ts`

```typescript
// frontend/lib/api/ci-cd.ts
import { apiClient, buildQuery, PaginatedResponse } from '@/lib/api-client';
import type { CiServer, WorkflowRun, WorkflowRunCommit, WorkflowJob, Release, Deployment } from '@/types/api';

const BASE = '/v1/ci-cd';

export const ciServersApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<CiServer>>(`${BASE}/servers${buildQuery(params)}`),
  getById: (id: number) =>
    apiClient.get<{ data: CiServer }>(`${BASE}/servers/${id}`),
  create: (data: Partial<CiServer>) =>
    apiClient.post<{ data: CiServer }>(`${BASE}/servers`, data),
  update: (id: number, data: Partial<CiServer>) =>
    apiClient.put<{ data: CiServer }>(`${BASE}/servers/${id}`, data),
  delete: (id: number) =>
    apiClient.del(`${BASE}/servers/${id}`),
};

export const workflowRunsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<WorkflowRun>>(`${BASE}/workflows/runs${buildQuery(params)}`),
  getById: (id: number) =>
    apiClient.get<{ data: WorkflowRun }>(`${BASE}/workflows/runs/${id}`),
  create: (data: Partial<WorkflowRun>) =>
    apiClient.post<{ data: WorkflowRun }>(`${BASE}/workflows/runs`, data),
  update: (id: number, data: Partial<WorkflowRun>) =>
    apiClient.put<{ data: WorkflowRun }>(`${BASE}/workflows/runs/${id}`, data),
  delete: (id: number) =>
    apiClient.del(`${BASE}/workflows/runs/${id}`),
};

export const workflowCommitsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<WorkflowRunCommit>>(`${BASE}/workflows/commits${buildQuery(params)}`),
  getById: (id: number) =>
    apiClient.get<{ data: WorkflowRunCommit }>(`${BASE}/workflows/commits/${id}`),
};

export const workflowJobsApi = {
  getAll: (workflowId: number, params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<WorkflowJob>>(`${BASE}/workflows/${workflowId}/jobs${buildQuery(params)}`),
  getById: (workflowId: number, jobId: number) =>
    apiClient.get<{ data: WorkflowJob }>(`${BASE}/workflows/${workflowId}/jobs/${jobId}`),
  create: (workflowId: number, data: Partial<WorkflowJob>) =>
    apiClient.post<{ data: WorkflowJob }>(`${BASE}/workflows/${workflowId}/jobs`, data),
  delete: (workflowId: number, jobId: number) =>
    apiClient.del(`${BASE}/workflows/${workflowId}/jobs/${jobId}`),
};

export const releasesApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Release>>(`${BASE}/releases${buildQuery(params)}`),
  getById: (id: number) =>
    apiClient.get<{ data: Release }>(`${BASE}/releases/${id}`),
  create: (data: Partial<Release>) =>
    apiClient.post<{ data: Release }>(`${BASE}/releases`, data),
  update: (id: number, data: Partial<Release>) =>
    apiClient.put<{ data: Release }>(`${BASE}/releases/${id}`, data),
  delete: (id: number) =>
    apiClient.del(`${BASE}/releases/${id}`),
};

export const deploymentsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Deployment>>(`${BASE}/deployments${buildQuery(params)}`),
  getById: (id: number) =>
    apiClient.get<{ data: Deployment }>(`${BASE}/deployments/${id}`),
  update: (id: number, data: Partial<Deployment>) =>
    apiClient.put<{ data: Deployment }>(`${BASE}/deployments/${id}`, data),
  // Note: no create/delete — deployments come from webhooks
};
```

```bash
git commit -m "feat(ci-cd): add complete CI/CD API module"
```

---

### Task 8.2: CI/CD Zod Types

**Files:**
- Modify: `frontend/types/api.ts`

```typescript
export const ciServerSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().min(1),
  url: z.string().url().nullable(),
  type: z.string().nullable(), // jenkins, github-actions, gitlab-ci, etc.
  description: nullableString(),
}).merge(timestampsSchema).merge(userReferenceSchema);
export type CiServer = z.infer<typeof ciServerSchema>;

export const workflowRunSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().min(1),
  status: z.string().nullable(), // success, failure, running, pending
  started_at: z.string().nullable(),
  finished_at: z.string().nullable(),
}).merge(timestampsSchema).merge(userReferenceSchema);
export type WorkflowRun = z.infer<typeof workflowRunSchema>;

export const workflowRunCommitSchema = z.object({
  id: z.number().int(),
  workflow_run_id: z.number().int(),
  sha: z.string(),
  message: z.string().nullable(),
  author: z.string().nullable(),
}).merge(timestampsSchema);
export type WorkflowRunCommit = z.infer<typeof workflowRunCommitSchema>;

export const workflowJobSchema = z.object({
  id: z.number().int(),
  workflow_run_id: z.number().int(),
  name: z.string().trim().min(1),
  status: z.string().nullable(),
  started_at: z.string().nullable(),
  finished_at: z.string().nullable(),
}).merge(timestampsSchema);
export type WorkflowJob = z.infer<typeof workflowJobSchema>;

export const releaseSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().min(1),
  version: z.string().nullable(),
  description: nullableString(),
  released_at: z.string().nullable(),
}).merge(timestampsSchema).merge(userReferenceSchema);
export type Release = z.infer<typeof releaseSchema>;

export const deploymentSchema = z.object({
  id: z.number().int(),
  environment: z.string().nullable(),
  status: z.string().nullable(), // pending, in_progress, success, failure
  deployed_at: z.string().nullable(),
  release_id: z.number().int().nullable(),
}).merge(timestampsSchema);
export type Deployment = z.infer<typeof deploymentSchema>;
```

```bash
git commit -m "feat(types): add Zod schemas for CI/CD domain"
```

---

### Task 8.3: CI/CD — Overview Page

**Files:**
- Modify: `frontend/app/[locale]/(protected)/ci-cd/page.tsx` — dashboard con estadísticas CI/CD
- Create: `frontend/components/ci-cd/CiCdOverview.tsx`
- Create: `frontend/components/ci-cd/RecentRunsWidget.tsx`
- Create: `frontend/components/ci-cd/DeploymentStatusWidget.tsx`
- Test + E2E

```bash
git commit -m "feat(ci-cd): add CI/CD overview dashboard page"
```

---

### Task 8.4: CI/CD Servers — CRUD Page

**Files:**
- Create: `frontend/app/[locale]/(protected)/ci-cd/servers/page.tsx`
- Create: `frontend/app/[locale]/(protected)/ci-cd/servers/[id]/page.tsx`
- Create: `frontend/components/ci-cd/ServerList.tsx`
- Create: `frontend/components/ci-cd/ServerDetail.tsx`
- Test + E2E: `frontend/e2e/ci-cd/servers.spec.ts`

```bash
git commit -m "feat(ci-cd): add CI server management pages"
```

---

### Task 8.5: Workflow Runs — Pages

**Files:**
- Create: `frontend/app/[locale]/(protected)/ci-cd/runs/page.tsx`
- Create: `frontend/app/[locale]/(protected)/ci-cd/runs/[id]/page.tsx`
- Create: `frontend/components/ci-cd/WorkflowRunList.tsx`
- Create: `frontend/components/ci-cd/WorkflowRunDetail.tsx` — tabs: Overview, Jobs, Commits
- Create: `frontend/components/ci-cd/JobList.tsx`
- Create: `frontend/components/ci-cd/CommitList.tsx`
- Test + E2E: `frontend/e2e/ci-cd/runs.spec.ts`

```bash
git commit -m "feat(ci-cd): add workflow run pages with jobs and commits"
```

---

### Task 8.6: Releases & Deployments — Pages

**Files:**
- Create: `frontend/app/[locale]/(protected)/ci-cd/releases/page.tsx`
- Create: `frontend/app/[locale]/(protected)/ci-cd/releases/[id]/page.tsx`
- Create: `frontend/app/[locale]/(protected)/ci-cd/deployments/page.tsx`
- Create: `frontend/components/ci-cd/ReleaseList.tsx`
- Create: `frontend/components/ci-cd/ReleaseDetail.tsx`
- Create: `frontend/components/ci-cd/DeploymentList.tsx`
- Create: `frontend/components/ci-cd/DeploymentTimeline.tsx` — timeline visual de deployments
- Test + E2E: `frontend/e2e/ci-cd/releases.spec.ts`

```bash
git commit -m "feat(ci-cd): add release and deployment pages"
```

---

## Fase 9: Dashboard & Search

### Task 9.1: Dashboard — Widgets con datos reales

**Files:**
- Modify: `frontend/app/[locale]/(protected)/dashboard/page.tsx`
- Create: `frontend/components/dashboard/widgets/ApiStatsWidget.tsx` — total APIs por estado, usa `apisApi.getAll`
- Create: `frontend/components/dashboard/widgets/ClusterHealthWidget.tsx` — estado clusters, usa `clustersApi.getAll`
- Create: `frontend/components/dashboard/widgets/RecentActivityWidget.tsx` — últimos creados/modificados
- Create: `frontend/components/dashboard/widgets/ComplianceWidget.tsx` — compliance standards overview
- Create: `frontend/components/dashboard/widgets/CiCdWidget.tsx` — últimos runs, deployment status
- Create: `frontend/components/dashboard/widgets/QuickActionsWidget.tsx` — crear API, buscar, ir a docs
- Test: `frontend/__tests__/components/dashboard/ApiStatsWidget.test.tsx`
- E2E: `frontend/e2e/dashboard/dashboard.spec.ts`

Cada widget debe:
- Mostrar loading skeleton mientras carga
- Manejar estado vacío
- Manejar errores

```bash
git commit -m "feat(dashboard): add real data widgets for all domains"
```

---

### Task 9.2: Global Search — Command Palette (Cmd+K)

**Files:**
- Create: `frontend/components/layout/CommandPalette.tsx` — overlay con búsqueda global
- Create: `frontend/hooks/useGlobalSearch.ts` — busca en paralelo en múltiples APIs
- Modify: `frontend/components/layout/AppSidebar.tsx` — agregar Cmd+K shortcut
- Test: `frontend/__tests__/components/layout/CommandPalette.test.tsx`
- E2E: `frontend/e2e/navigation/command-palette.spec.ts`

Búsqueda en: APIs, Components, Clusters, Teams, Business Domains, Entities, Systems.
Usar `?search=term` query param en cada API.

```bash
git commit -m "feat(search): add global command palette with Cmd+K"
```

---

## Fase 10: Admin & Taxonomías

### Task 10.1: Componente genérico TaxonomyManager

**Files:**
- Create: `frontend/components/admin/TaxonomyManager.tsx`
- Test: `frontend/__tests__/components/admin/TaxonomyManager.test.tsx`

```typescript
// Props del TaxonomyManager
interface TaxonomyManagerProps<T> {
  title: string;
  description?: string;
  api: {
    getAll: (params?: Record<string, unknown>) => Promise<PaginatedResponse<T>>;
    create: (data: Partial<T>) => Promise<{ data: T }>;
    update: (id: number, data: Partial<T>) => Promise<{ data: T }>;
    delete: (id: number) => Promise<void>;
  };
  columns: Array<{ key: keyof T; label: string }>;
  formFields: Array<{ name: string; label: string; type: 'text' | 'textarea'; required?: boolean }>;
}
```

Este componente se reusa en TODAS las páginas admin:
- API Types → `apiTypesApi`
- API Categories → `apiCategoriesApi`
- API Statuses → `serviceStatusesApi`
- Component Types → `componentTypesApi`
- Cluster Types → `clusterTypesApi`
- Group Types → `groupTypesApi`
- Member Roles → `groupMemberRolesApi`
- Link Categories → `linkCategoriesApi`
- Resource Categories → `resourceCategoriesApi`
- Lifecycle Phases → `lifecycleApi`
- Infrastructure Types → `infrastructureTypesApi`

```bash
git commit -m "feat(admin): add generic TaxonomyManager component"
```

---

### Task 10.2: Admin Pages — Conectar con TaxonomyManager

**Files:**
- Modify: `frontend/app/[locale]/(protected)/admin/api-types/page.tsx`
- Modify: `frontend/app/[locale]/(protected)/admin/api-statuses/page.tsx`
- Modify: `frontend/app/[locale]/(protected)/admin/api-categories/page.tsx`
- Modify: `frontend/app/[locale]/(protected)/admin/group-types/page.tsx`
- Modify: `frontend/app/[locale]/(protected)/admin/member-roles/page.tsx`
- Create: `frontend/app/[locale]/(protected)/admin/cluster-types/page.tsx`
- Create: `frontend/app/[locale]/(protected)/admin/link-categories/page.tsx`
- Create: `frontend/app/[locale]/(protected)/admin/resource-categories/page.tsx`
- Create: `frontend/app/[locale]/(protected)/admin/component-types/page.tsx`
- Create: `frontend/app/[locale]/(protected)/admin/infrastructure-types/page.tsx`
- Create: `frontend/app/[locale]/(protected)/admin/lifecycle-phases/page.tsx`
- E2E: `frontend/e2e/admin/taxonomy-crud.spec.ts` — un test genérico que cubre cada tipo

Cada página simplemente importa TaxonomyManager y pasa el api module + config:

```tsx
// Ejemplo: admin/api-types/page.tsx
import { TaxonomyManager } from '@/components/admin/TaxonomyManager';
import { apiTypesApi } from '@/lib/api/api-extended';

export default function ApiTypesPage() {
  return (
    <TaxonomyManager
      title="API Types"
      description="Manage the types of APIs in your catalog"
      api={apiTypesApi}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
      ]}
      formFields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  );
}
```

```bash
git commit -m "feat(admin): connect all taxonomy pages with TaxonomyManager"
```

---

## Fase 11: Playwright E2E Test Suite

> COBERTURA OBJETIVO: Todo flujo de usuario principal tiene E2E test

### Estructura de E2E Tests

```
frontend/e2e/
├── fixtures.ts              # ✅ Existe — helpers, auth fixture
├── auth/
│   ├── login.spec.ts        # ✅ Existe
│   ├── register.spec.ts     # 🆕
│   └── protected-routes.spec.ts # 🆕 (Task 0.4)
├── navigation/
│   ├── sidebar.spec.ts      # ✅ Existe
│   └── command-palette.spec.ts # 🆕 (Task 9.2)
├── dashboard/
│   └── dashboard.spec.ts    # 🆕 (Task 9.1)
├── apis/
│   ├── apis-list.spec.ts    # ✅ Existe
│   ├── create-api-wizard.spec.ts # ✅ Existe
│   ├── api-detail.spec.ts   # 🆕
│   └── api-docs.spec.ts     # 🆕
├── catalog/
│   ├── components.spec.ts   # 🆕
│   ├── resources.spec.ts    # 🆕 (Task 1.6)
│   ├── service-models.spec.ts # 🆕 (Task 1.4)
│   └── frameworks.spec.ts   # 🆕
├── infrastructure/
│   ├── overview.spec.ts     # ✅ Existe
│   ├── clusters.spec.ts     # ✅ Existe
│   ├── cluster-types.spec.ts # ✅ Existe
│   ├── cluster-service-accounts.spec.ts # ✅ Existe
│   ├── nodes.spec.ts        # ✅ Existe
│   ├── environments.spec.ts # 🆕 (Task 1.5)
│   ├── vendors.spec.ts      # 🆕 (Task 3.4)
│   └── infra-types.spec.ts  # 🆕 (Task 3.3)
├── architecture/
│   ├── systems.spec.ts      # 🆕 (Task 2.4)
│   ├── entities.spec.ts     # 🆕 (Task 2.5)
│   └── capabilities.spec.ts # 🆕 (Task 2.3)
├── business/
│   ├── domains.spec.ts      # 🆕 (Task 2.6)
│   ├── tiers.spec.ts        # 🆕
│   └── lifecycles.spec.ts   # 🆕 (Task 2.7)
├── organization/
│   ├── teams.spec.ts        # 🆕 (Task 4.4)
│   └── users.spec.ts        # 🆕 (Task 4.3)
├── security/
│   ├── auth-methods.spec.ts # 🆕 (Task 5.2)
│   └── service-accounts.spec.ts # 🆕 (Task 5.3)
├── compliance/
│   └── standards.spec.ts    # 🆕 (Task 6.2)
├── operations/
│   └── metrics.spec.ts      # 🆕 (Task 7.2)
├── ci-cd/
│   ├── servers.spec.ts      # 🆕 (Task 8.4)
│   ├── runs.spec.ts         # 🆕 (Task 8.5)
│   └── releases.spec.ts     # 🆕 (Task 8.6)
├── integration/
│   ├── links.spec.ts        # ✅ Existe
│   └── link-types.spec.ts   # ✅ Existe
├── platform/
│   ├── platforms.spec.ts    # ✅ Existe
│   └── component-types.spec.ts # ✅ Existe
├── technology/
│   ├── languages.spec.ts    # 🆕 (Task 1.8)
│   └── frameworks.spec.ts   # 🆕 (Task 1.7)
└── admin/
    └── taxonomy-crud.spec.ts # 🆕 (Task 10.2)
```

### Task 11.1: Auth E2E — Register test

**File:** `frontend/e2e/auth/register.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Register', () => {
  test('shows register form', async ({ page }) => {
    await page.goto('/en/register');
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
    await expect(page.locator('[name="name"]')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.locator('[name="password_confirmation"]')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    await page.goto('/en/register');
    await page.click('button[type="submit"]');
    await expect(page.getByText(/required/i)).toBeVisible();
  });
});
```

```bash
git commit -m "test(e2e): add register page E2E tests"
```

---

### Task 11.2: API Detail E2E

**File:** `frontend/e2e/apis/api-detail.spec.ts`

```typescript
import { test, expect } from './fixtures';

test.describe('API Detail', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to first API in list
    await authenticatedPage.goto('/en/apis');
    await authenticatedPage.locator('[data-testid="api-card"]').first().click();
  });

  test('shows API detail header', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByRole('heading')).toBeVisible();
  });

  test('shows tabs: Overview, Docs, Dependencies', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByRole('tab', { name: /overview/i })).toBeVisible();
    await expect(authenticatedPage.getByRole('tab', { name: /docs/i })).toBeVisible();
  });

  test('can switch between tabs', async ({ authenticatedPage }) => {
    await authenticatedPage.getByRole('tab', { name: /docs/i }).click();
    await expect(authenticatedPage.locator('[data-testid="swagger-ui"]')).toBeVisible();
  });
});
```

```bash
git commit -m "test(e2e): add API detail page E2E tests"
```

---

### Task 11.3: E2E Pattern template — CRUD genérico

Para todas las páginas de CRUD, usar este patrón base:

```typescript
// Template: e2e/<domain>/<entity>.spec.ts
import { test, expect } from '@playwright/test';

// Import authenticated page fixture
test.use({ storageState: 'e2e/.auth/admin.json' });

test.describe('<Entity> CRUD', () => {
  const BASE_URL = '/en/<path>';

  test('list page loads and shows table', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByRole('heading', { name: /<entity>/i })).toBeVisible();
    // Should show table or card grid
    await expect(page.locator('table, [data-testid="entity-grid"]')).toBeVisible();
  });

  test('can create new entity', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('[data-testid="create-button"]');
    await page.fill('[name="name"]', 'Test Entity');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Test Entity')).toBeVisible();
  });

  test('can view entity detail', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('tr, [data-testid="entity-card"]').first().click();
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('can edit entity', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-testid="edit-button"]').first().click();
    await page.fill('[name="name"]', 'Updated Entity');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Updated Entity')).toBeVisible();
  });

  test('can delete entity', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-testid="delete-button"]').first().click();
    await page.click('[data-testid="confirm-delete"]');
    // Verify entity removed from list
  });

  test('handles empty state', async ({ page }) => {
    // Test with no data
    await page.goto(BASE_URL);
    // If no data, should show empty state
  });

  test('pagination works', async ({ page }) => {
    await page.goto(BASE_URL);
    const nextButton = page.locator('[data-testid="next-page"]');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page).toHaveURL(/page=2/);
    }
  });

  test('search/filter works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('[data-testid="search-input"]', 'test');
    await page.waitForTimeout(500); // debounce
    // Results should be filtered
  });
});
```

Aplicar este template para cada E2E spec nuevo marcado con 🆕 arriba.

```bash
git commit -m "test(e2e): add CRUD E2E tests for all domains"
```

---

### Task 11.4: Playwright Auth Fixture — Storage State

**File:** `frontend/e2e/fixtures.ts` (ampliar)

```typescript
import { test as base } from '@playwright/test';
import path from 'path';

const ADMIN_STORAGE = path.join(__dirname, '.auth/admin.json');

// Setup: login and save state
export const setup = base.extend({});
setup('authenticate as admin', async ({ page }) => {
  await page.goto('/en/login');
  await page.fill('[name="email"]', process.env.E2E_ADMIN_EMAIL || 'admin@atlas.test');
  await page.fill('[name="password"]', process.env.E2E_ADMIN_PASSWORD || 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: ADMIN_STORAGE });
});

// Authenticated test fixture
export const test = base.extend({
  storageState: ADMIN_STORAGE,
});

export { expect } from '@playwright/test';
```

**File:** `frontend/playwright.config.ts` — agregar setup project:

```typescript
projects: [
  { name: 'setup', testMatch: /global-setup\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/admin.json' },
    dependencies: ['setup'],
  },
],
```

```bash
git commit -m "test(e2e): add Playwright auth fixture with storage state"
```

---

### Task 11.5: RBAC E2E Tests — Role-based access

**File:** `frontend/e2e/auth/rbac.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('RBAC - Role Based Access', () => {
  test('admin can access admin pages', async ({ page }) => {
    // Login as admin
    await page.goto('/en/login');
    await page.fill('[name="email"]', 'admin@atlas.test');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.goto('/en/admin/api-types');
    await expect(page.getByRole('heading', { name: /api types/i })).toBeVisible();
  });

  test('viewer cannot see create/edit/delete buttons', async ({ page }) => {
    // Login as viewer
    await page.goto('/en/login');
    await page.fill('[name="email"]', 'viewer@atlas.test');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.goto('/en/apis');
    await expect(page.locator('[data-testid="create-button"]')).not.toBeVisible();
  });

  test('editor can create but not delete', async ({ page }) => {
    // Login as editor
    await page.goto('/en/login');
    await page.fill('[name="email"]', 'editor@atlas.test');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.goto('/en/apis');
    await expect(page.locator('[data-testid="create-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="delete-button"]')).not.toBeVisible();
  });
});
```

```bash
git commit -m "test(e2e): add RBAC access control E2E tests"
```

---

## Apéndice: Endpoint Map Completo

### Auth Domain (no prefix)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| POST | `/v1/auth/login` | ❌ | `lib/api/auth.ts` |
| POST | `/v1/auth/register` | ❌ | `lib/api/auth.ts` |
| GET | `/v1/auth/me` | ✅ | `lib/api/auth.ts` |
| POST | `/v1/auth/logout` | ✅ | `lib/api/auth.ts` |

### Catalog Domain (`/v1/catalog/`)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| GET | `apis` | ❌ | `lib/api/apis.ts` |
| GET | `apis/{api}` | ❌ | `lib/api/apis.ts` |
| POST | `apis` | ✅ | `lib/api/apis.ts` |
| PUT | `apis/{api}` | ✅ | `lib/api/apis.ts` |
| DELETE | `apis/{api}` | ✅ | `lib/api/apis.ts` |
| GET | `apis/{api}/components` | ❌ | `lib/api/apis.ts` |
| GET | `apis/types` | ❌ | `lib/api/api-extended.ts` |
| GET | `apis/types/{type}` | ❌ | `lib/api/api-extended.ts` |
| POST | `apis/types` | ✅ | `lib/api/api-extended.ts` |
| PUT | `apis/types/{type}` | ✅ | `lib/api/api-extended.ts` |
| DELETE | `apis/types/{type}` | ✅ | `lib/api/api-extended.ts` |
| GET | `apis/categories` | ❌ | `lib/api/api-extended.ts` |
| GET | `apis/categories/{cat}` | ❌ | `lib/api/api-extended.ts` |
| POST | `apis/categories` | ✅ | `lib/api/api-extended.ts` |
| PUT | `apis/categories/{cat}` | ✅ | `lib/api/api-extended.ts` |
| DELETE | `apis/categories/{cat}` | ✅ | `lib/api/api-extended.ts` |
| GET | `apis/access-policies` | ❌ | `lib/api/api-extended.ts` |
| GET | `apis/access-policies/{id}` | ❌ | `lib/api/api-extended.ts` |
| GET | `apis/access-policies/{id}/apis` | ❌ | `lib/api/api-extended.ts` |
| GET/POST/PUT/DELETE | `components` | ❌/✅ | `lib/api/components.ts` |
| GET | `components/types` | ❌ | `lib/api/platform.ts` |
| GET/POST/PUT/DELETE | `environments` | ❌/✅ | `lib/api/environments.ts` |
| GET/POST/PUT/DELETE | `frameworks` | ❌/✅ | `lib/api/frameworks.ts` |
| GET | `frameworks/{f}/components` | ❌ | `lib/api/frameworks.ts` |
| GET/POST/PUT/DELETE | `links` | ❌/✅ | `lib/api/integration.ts` |
| GET/POST/PUT/DELETE | `links/categories` | ❌/✅ | `lib/api/integration.ts` |
| GET/POST/PUT/DELETE | `platforms` | ❌/✅ | `lib/api/platform.ts` |
| GET | `platforms/{p}/components` | ❌ | `lib/api/platform.ts` |
| GET/POST/PUT/DELETE | `programming-languages` | ❌/✅ | `lib/api/programming-languages.ts` |
| GET/POST/PUT/DELETE | `resources` | ❌/✅ | `lib/api/resources.ts` |
| GET/POST/PUT/DELETE | `resources/categories` | ❌/✅ | `lib/api/resources.ts` |
| GET/POST/PUT/DELETE | `service-models` | ❌/✅ | `lib/api/service-models.ts` |

### Architecture Domain (`/v1/architecture/`)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| GET/POST/PUT/DELETE | `business-capabilities` | ✅ | `lib/api/architecture.ts` |
| GET | `business-capabilities/{id}/systems` | ✅ | `lib/api/architecture.ts` |
| GET/POST/PUT/DELETE | `business-capability-systems` | ✅ | `lib/api/architecture.ts` |
| GET/POST/PUT/DELETE | `business-domains` | ✅ | `lib/api/business-domains.ts` |
| GET | `business-domains/{id}/components` | ✅ | `lib/api/business-domains.ts` |
| GET | `business-domains/{id}/entities` | ✅ | `lib/api/business-domains.ts` |
| GET/POST/PUT/DELETE | `business-tiers` | ✅ | `lib/api/business.ts` |
| GET/POST/PUT/DELETE | `entities` | ✅ | `lib/api/architecture.ts` |
| GET/POST/PUT/DELETE | `entities/{e}/attributes` | ✅ | `lib/api/architecture.ts` |
| GET | `entities/{e}/components` | ✅ | `lib/api/architecture.ts` |
| GET/POST/PUT/DELETE | `lifecycles` | ✅ | `lib/api/lifecycles.ts` |
| GET | `lifecycles/{l}/components` | ✅ | `lib/api/lifecycles.ts` |
| GET/POST/PUT/DELETE | `systems` | ✅ | `lib/api/architecture.ts` |
| GET | `systems/{s}/components` | ✅ | `lib/api/architecture.ts` |
| GET/POST/PUT/DELETE | `infrastructure-types` | ✅ | `lib/api/architecture.ts` |

### Infrastructure Domain (`/v1/infrastructure/`)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| GET/POST/PUT/DELETE | `clusters` | ✅ | `lib/api/infrastructure.ts` |
| GET | `clusters/{c}/nodes` | ✅ | `lib/api/infrastructure.ts` |
| GET | `clusters/{c}/service-accounts` | ✅ | `lib/api/infrastructure.ts` |
| GET/POST/PUT/DELETE | `clusters/types` | ✅ | `lib/api/infrastructure.ts` |
| GET/POST/PUT/DELETE | `nodes` | ✅ | `lib/api/infrastructure.ts` |
| GET/POST/PUT/DELETE | `environments` | ✅ | `lib/api/infrastructure.ts` |
| GET/POST/PUT/DELETE | `infrastructure-types` | ✅ | `lib/api/infrastructure-types.ts` |
| GET/POST/PUT/DELETE | `vendors` | ✅ | `lib/api/technology.ts` |

### Organization Domain (`/v1/organization/`)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| GET/POST/PUT/DELETE | `groups` | ✅ | `lib/api/groups.ts` |
| GET/POST/PUT/DELETE | `groups/types` | ✅ | `lib/api/groups.ts` |
| GET/POST/PUT/DELETE | `groups/member-roles` | ✅ | `lib/api/groups.ts` |
| GET/POST/PUT/DELETE | `users` | ✅ | `lib/api/users.ts` 🆕 |

### Security Domain (`/v1/security/`)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| GET/POST/PUT/DELETE | `authentication-methods` | ✅ | `lib/api/security.ts` |
| GET/POST/PUT/DELETE | `service-accounts` | ✅ | `lib/api/service-accounts.ts` |
| GET/POST/PUT/DELETE | `service-accounts/tokens` | ✅ | `lib/api/security.ts` |

### Compliance Domain (`/v1/compliance/`)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| GET/POST/PUT/DELETE | `compliance-standards` | ✅ | `lib/api/compliance.ts` |
| GET/POST/PUT/DELETE | `compliance-requirements` | ✅ | `lib/api/compliance.ts` 🆕 |

### Operations Domain (`/v1/operations/`)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| GET/POST/PUT/DELETE | `service-statuses` | ✅ | `lib/api/operations.ts` 🆕 |
| GET/POST/PUT/DELETE | `metrics` | ✅ | `lib/api/operations.ts` 🆕 |

### CI/CD Domain (`/v1/ci-cd/`)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| GET/POST/PUT/DELETE | `servers` | ✅ | `lib/api/ci-cd.ts` 🆕 |
| GET/POST/PUT/DELETE | `workflows/runs` | ✅ | `lib/api/ci-cd.ts` 🆕 |
| GET | `workflows/commits` | ✅ | `lib/api/ci-cd.ts` 🆕 |
| GET | `workflows/commits/{id}` | ✅ | `lib/api/ci-cd.ts` 🆕 |
| GET/POST/DELETE | `workflows/{w}/jobs` | ✅ | `lib/api/ci-cd.ts` 🆕 |
| GET/POST/PUT/DELETE | `releases` | ✅ | `lib/api/ci-cd.ts` 🆕 |
| GET/PUT | `deployments` | ✅ | `lib/api/ci-cd.ts` 🆕 |

### Webhooks (`/v1/webhooks/`)

| Method | Endpoint | Auth | Frontend Module |
|--------|----------|------|-----------------|
| POST | `deployments` | Token | N/A (inbound webhook, no UI needed) |

---

## Resumen de Prioridades

| Prioridad | Fase | Descripción | Tasks | Archivos Nuevos ~Aprox |
|-----------|------|-------------|-------|----------------------|
| 🔴 Crítica | 0 | Auth & API Client | 4 | 5 |
| 🔴 Crítica | 1 | Catalog domain (completar) | 8 | 15 |
| 🟡 Alta | 2 | Architecture domain | 7 | 20 |
| 🟡 Alta | 3 | Infrastructure (completar) | 4 | 8 |
| 🟡 Alta | 4 | Organization (users, teams) | 5 | 12 |
| 🟡 Alta | 8 | CI/CD domain (100% nuevo) | 6 | 25 |
| 🟠 Media | 5 | Security (completar) | 3 | 10 |
| 🟠 Media | 6 | Compliance (completar) | 2 | 8 |
| 🟠 Media | 7 | Operations (nuevo) | 2 | 6 |
| 🟠 Media | 9 | Dashboard & Search | 2 | 10 |
| 🟢 Baja | 10 | Admin & Taxonomías | 2 | 15 |
| 🟢 Baja | 11 | Playwright E2E suite | 5 | 30 |
| **TOTAL** | | | **50 tasks** | **~164 archivos** |

---

## Orden de Ejecución Recomendado

```
Sprint 1: Fase 0 (Auth) → Fase 1 (Catalog verify+complete)
Sprint 2: Fase 2 (Architecture) → Fase 3 (Infrastructure)
Sprint 3: Fase 4 (Organization) → Fase 5 (Security)
Sprint 4: Fase 8 (CI/CD) → Fase 6 (Compliance) → Fase 7 (Operations)
Sprint 5: Fase 9 (Dashboard) → Fase 10 (Admin) → Fase 11 (E2E suite)
```

Cada sprint termina con: tests verdes, TypeScript sin errores, lint limpio, commit y push.

---

## Notas Importantes

1. **Backend query params**: Usar `?filter[field]=value`, `?search=term`, `?sort=field/-field`, `?with=relation`, `?per_page=25`, `?page=2`
2. **Respuestas paginadas**: `{ data: [...], links: {...}, meta: { current_page, last_page, per_page, total } }`
3. **i18n**: Todo texto visible al usuario debe ir en `messages/en.json` y `messages/es.json`
4. **RBAC**: Admin=CRUD, Editor=CRU (no delete), Viewer=R only, Guest=public only. Ocultar botones según rol.
5. **Error handling**: Usar `ApiError` class del api-client. Mostrar toast con error.message.
6. **Loading states**: Skeleton components en cada page mientras cargan datos.
7. **Catálogo público vs auth**: Las rutas GET del catalog domain NO requieren auth. Las rutas POST/PUT/DELETE SÍ.
8. **data-testid**: Usar `data-testid` en todos los elementos interactivos para Playwright. Convención: `{entity}-{action}` (ej: `api-card`, `create-button`, `delete-confirm`).
