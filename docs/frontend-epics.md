# Frontend Integration Epics

This document outlines the major epics required to deliver a fully connected Next.js frontend that consumes the Laravel Atlas Catalog backend. Each epic captures the scope, backend dependencies, and key deliverables so the team can plan work iteratively.

---

## 1. Frontend Foundation & Tooling

-   **Goal:** Establish a production-ready Next.js stack aligned with project conventions.
-   **Scope:**
    -   App Router baseline with shared layout, theming, and typography.
    -   Tailwind configuration, design tokens, and reusable UI components.
    -   Global error boundary, loading skeletons, and toast notifications.
    -   Environment configuration for API base URL, timeouts, and auth headers.
    -   Linting, testing (Jest + Testing Library), storybook (optional) and CI updates.
-   **Backend touchpoints:** None (infrastructure only).

## 2. Internationalization & Accessibility

-   **Goal:** Deliver a multilingual, accessible UI consistent with next-intl implementation.
-   **Scope:**
    -   Finalize locale routing structure (`/[locale]/...`) and middleware fallbacks.
    -   Complete translation coverage for shared components, navigation, and toasts.
    -   Establish content guidelines for translators and missing key detection.
    -   Accessibility sweeps (ARIA labels, keyboard navigation, color contrast).
-   **Backend touchpoints:** Ensure backend error messages surfaced to the UI are translatable or mapped.

## 3. Authentication & Session Management

-   **Goal:** Respect backend security, providing authenticated access where required.
-   **Scope:**
    -   Implement login/logout flows (likely JWT or session cookie once backend is defined).
    -   Persist session tokens (httpOnly cookie or secure storage) and inject auth headers via `apiClient`.
    -   Handle 401/403 responses with redirects and user messaging.
    -   Guard privileged routes and hide actions without permission.
-   **Backend touchpoints:** Auth endpoints (TBD) plus middleware enforcing policies.

## 4. API Catalog Browsing Experience

-   **Goal:** Allow users to discover APIs with filterable, paginated listings.
-   **Scope:**
    -   `/apis` listing using `ApiController@index` (pagination, sorting, search term support if available).
    -   Filters by type, status, lifecycle, programming language (fan-out to supporting endpoints).
    -   Quick stats (total count, recently added) and empty-state messaging.
    -   Client-side caching / SWR for faster navigation.
-   **Backend touchpoints:** `GET /apis`, `GET /api-types`, `GET /api-statuses`, `GET /lifecycles`, `GET /programming-languages`.

## 5. API Detail & Documentation View

-   **Goal:** Surface rich API metadata, documentation links, and governance details.
-   **Scope:**
    -   `/apis/[id]` detail page using `ApiController@show`.
    -   Sections for description, version history (if exposed), owner info, business domain, discovery source.
    -   Display related resources: access policy, authentication method, vendor, frameworks.
    -   Provide download links/spec previews when `document_specification` is a URL or JSON blob.
-   **Backend touchpoints:** `GET /apis/{id}` plus ancillary resources (`ApiAccessPolicyResource`, `AuthenticationMethodResource`, `VendorResource`, etc.).

## 6. API Lifecycle Management (CRUD)

-   **Goal:** Enable creation and maintenance of API records from the UI.
-   **Scope:**
    -   Create/Edit forms for APIs using `POST /apis` and `PUT /apis/{id}` with validation feedback.
    -   Delete flow with confirmation modal (`DELETE /apis/{id}`).
    -   Form-level Zod schemas mirroring backend FormRequests to ensure parity.
    -   Inline validation (field-level errors) and optimistic updates when possible.
-   **Backend touchpoints:** `ApiController` store/update/destroy endpoints and validation rules.

## 7. Supporting Taxonomy Management

-   **Goal:** Provide UI to manage supporting dictionaries required by APIs.
-   **Scope:**
    -   CRUD views for Types, Statuses, Lifecycles, Programming Languages, Business Domains, Business Tiers, Frameworks, Vendors, Authentication Methods, Resource Types, Resources, Access Policies.
    -   Shared table component with pagination, filters, and inline edit or detail modals.
    -   Ensure dependencies (e.g., deleting a type referenced by an API) surface backend errors clearly.
-   **Backend touchpoints:** Respective controllers (`ApiTypeController`, `ApiStatusController`, `LifecycleController`, `ProgrammingLanguageController`, `BusinessDomainController`, `BusinessTierController`, `FrameworkController`, `VendorController`, `AuthenticationMethodController`, `ResourceController`, `ResourceTypeController`, `ApiAccessPolicyController`).

## 8. Observability & Error Handling

-   **Goal:** Provide administrators insight into data-sync health and user-friendly failure modes.
-   **Scope:**
    -   Centralized error boundary surfaces backend error messages plus context.
    -   Integrate logging/monitoring (Sentry, LogRocket) for frontend issues.
    -   Offline/timeout states from `apiClient` with retry/backoff strategy.
    -   Usage metrics (optional dashboards) to understand catalog activity.
-   **Backend touchpoints:** Error response formats; potential metrics endpoints.

## 9. Deployment & Environment Alignment

-   **Goal:** Ensure frontend deployment lifecycle meshes with backend environments.
-   **Scope:**
    -   Configure environment-specific API URLs (dev/staging/prod).
    -   Validate CORS and auth flows across environments.
    -   Update CI/CD pipeline (GitHub Actions) to build/test/deploy Next.js.
    -   Smoke test scripts that hit live backend endpoints post-deploy.
-   **Backend touchpoints:** CORS config, versioned API releases, health-check endpoints.

## 10. Documentation & Handover

-   **Goal:** Keep engineering, product, and support aligned.
-   **Scope:**
    -   Update README and developer docs with setup steps, architectural diagram, and API contracts.
    -   Maintain API schema mapping (backend Resource -> frontend Zod schema).
    -   Provide user guides for catalog administrators and consumers.
    -   Document future roadmap items (analytics, bulk import/export, webhook integrations).
-   **Backend touchpoints:** Shared API documentation (OpenAPI/Stoplight) to keep aligned.

---

### Suggested Sequencing

1. Foundation & Tooling (Epic 1) alongside i18n/accessibility (Epic 2).
2. Establish authentication (Epic 3).
3. Deliver core browsing and detail experiences (Epics 4 & 5).
4. Expand to CRUD management (Epic 6) and supporting dictionaries (Epic 7).
5. Add observability, deployment hardening, and documentation (Epics 8–10).

This structure should provide a clear roadmap for implementing the connected frontend while keeping scope manageable per iteration.
