# Atlas Catalog API Documentation Strategy

## Overview

The Atlas Catalog API is documented using **Scramble**, an OpenAPI auto-generation library that infers specifications from Laravel code. This document outlines the documentation strategy and improvement opportunities.

**Date Created:** March 6, 2026  
**Status:** Phase 5.1 - API Documentation Implementation (In Progress)

---

## 1. Current State

### Architecture

- **Free Tier:** Auto-generation from controllers, requests, resources
- **Installed Version:** `dedoc/scramble: ^0.13.8`
- **Access Point:** `/docs/api` (UI hosted on application)
- **Export Format:** OpenAPI 3.0.3
- **Number of Controllers:** 61 (across 6 domains)
- **Manual Spec:** ❌ Eliminated (was `docs/api/v1.0.0.yml`)

### What Scramble Infers Automatically ✅

From existing code structure:

| Inferrable Element | Source                                                      | Example                               |
| ------------------ | ----------------------------------------------------------- | ------------------------------------- |
| Endpoints          | Routes (`routes/v1/*.php`)                                  | `GET /api/v1/catalog/components`      |
| HTTP Methods       | Controllers (`index`, `store`, `show`, `update`, `destroy`) | POST, PUT, DELETE                     |
| Request Parameters | Form Request classes (`StoreComponentRequest`)              | $request->validated() fields          |
| Response Structure | Resources (`ComponentResource`)                             | Mapped from model attributes          |
| Status Codes       | Return types + HTTP conventions                             | 200, 201, 422, etc.                   |
| Authentication     | Middleware configuration                                    | Bearer token via Sanctum              |
| Tags/Grouping      | Route file structure                                        | `v1/catalog`, `v1/architecture`, etc. |
| Pagination         | `LengthAwarePaginator` return type                          | `meta`, `links`, `data`               |

### What Requires Additional Annotation 📝

| Element                  | Scramble Free | Scramble Pro | Our Current State                  |
| ------------------------ | ------------- | ------------ | ---------------------------------- |
| Endpoint descriptions    | Manual PHPDoc | Auto         | ✅ Partial (method comments exist) |
| Response examples        | ❌            | ✅ Auto      | ❌ None                            |
| Webhook documentation    | ❌            | ✅           | ❌ Need Pro for Task 1.3           |
| API versioning           | ❌            | ✅           | N/A (only v1)                      |
| Operationld (unique IDs) | Manual PHPDoc | Auto         | ❌ None                            |
| Query param descriptions | Partial       | Better       | ⚠️ Limited                         |
| Security schemes docs    | Limited       | Better       | ⚠️ Basic                           |
| Deprecated endpoints     | Manual        | Better       | N/A (new API)                      |

---

## 2. Task 9.2: Improve PHPDoc Annotations

### Goal

Enhance Scramble's OpenAPI output with richer documentation that helps API consumers understand what each endpoint does and how to use it.

### Strategy: Focused Annotation Approach

Rather than annotating all 61 controllers at once (estimated 15+ hours), we use a **progressive enhancement** strategy:

**Phase 1 (Current - 2-3h):** Core Controllers (highest traffic)

- ComponentController (catalog domain hub)
- ApiController (api domain)
- SystemController (architecture domain)
- ClusterController (infrastructure domain)
- UserController (organization domain)
- DeploymentController (ci-cd domain)
- ComplianceStandardController (compliance domain)

**Phase 2 (Future - 4-5h):** Supporting Controllers

- All relationship controllers (ComponentSystemController, BusinessCapabilitySystemController, etc.)
- Lookup controllers (types, categories, enums)

**Phase 3 (Future - 3-4h):** Documentation Polish

- Edge case controllers
- Webhook and event controllers

### Annotation Pattern

Add these PHPDoc elements to controller methods:

```php
/**
 * Display a listing of [Resource] items with filtering, searching, and sorting.
 *
 * Supports filtering, searching, and sorting via query parameters:
 * - `?filter[field]=value` - Filter by field value
 * - `?search=term` - Search across searchable fields
 * - `?sort=field` or `?sort=-field` - Sort ascending / descending
 * - `?with=relation1,relation2` - Eager load relationships (see Allowed Relationships)
 * - `?per_page=25` - Set items per page (default: 15)
 *
 * @operationId listResources
 * @response 200 Returns paginated list of resources
 * @response 401 Unauthenticated
 * @response 403 Unauthorized (insufficient permissions)
 */
public function index(Request $request): ComponentResourceCollection
```

### Key Annotations to Add

#### 1. @operationId

Unique identifier for the operation. Helps API clients generate method names.

```php
// Pattern: [verb][Resource]
@operationId listComponents
@operationId getComponent
@operationId createComponent
@operationId updateComponent
@operationId deleteComponent
@operationId listComponentApis
```

#### 2. @response

Document specific HTTP response codes and meanings.

```php
@response 200 Successfully retrieved resource(s)
@response 201 Resource created successfully
@response 400 Invalid request data
@response 401 Unauthenticated - Missing or invalid token
@response 403 Unauthorized - Insufficient permissions (RBAC)
@response 404 Resource not found
@response 422 Validation failed
```

#### 3. Enhance Existing Field Descriptions

For complex parameters, add validation/options info:

```php
/**
 * Create a new component.
 *
 * @param StoreComponentRequest $request - Validated via FormRequest:
 *   - name (required, string, unique among active components)
 *   - slug (optional, auto-generated from name if empty)
 *   - description (required, string, 500 chars max)
 *   - status_id (required, must be "active" or "inactive")
 *   - platform_id (required, valid platform FK)
 *   - ...
 */
public function store(StoreComponentRequest $request): ComponentResource
```

#### 4. Tag Declarations (optional but helpful)

```php
class ComponentController extends Controller {
    // High-level tag: "Catalog - Components"
    // Used for UI grouping
}
```

Scramble infers tags from route files, but explicit `@tag` can override.

---

## 3. Task 9.3: Verify Comprehensive Coverage

### Checklist: All 61 Controllers Documented

#### Catalog Domain (9 controllers)

- [ ] ComponentController ✅ (already has good docs)
- [ ] ApiController ✅ (already has good docs)
- [ ] ServiceModelController
- [ ] CategoryController
- [ ] ComponentTypeController
- [ ] ComplianceStandardController
- [ ] CategoryController
- [ ] LinkController
- [ ] LinkCategoryController

#### Architecture Domain (7 controllers)

- [ ] SystemController ✅ (has good docs)
- [ ] EntityController
- [ ] EntityAttributeController
- [ ] BusinessCapabilityController
- [ ] BusinessDomainController
- [ ] BusinessTierController
- [ ] FrameworkTypeController

#### Infrastructure Domain (8 controllers)

- [ ] ClusterController ✅ (has good docs)
- [ ] NodeController
- [ ] ClusterTypeController
- [ ] InfrastructureTypeController
- [ ] EnvironmentController
- [ ] PlatformController
- [ ] VendorController
- [ ] ProgrammingLanguageController

#### Operations Domain (9 controller groups)

- [ ] DeploymentController ✅ (has good docs)
- [ ] ServiceAccountController
- [ ] DeploymentWebhookController
- [ ] ServiceStatusController
- [ ] ServiceStatusTypeController

#### Security Domain (3 controllers)

- [ ] ApiAccessPolicyController
- [ ] AuthenticationMethodController
- [ ] ServiceAccountTokenController

#### Organization Domain (5 controllers)

- [ ] UserController ✅ (has good docs)
- [ ] GroupController
- [ ] GroupMemberRoleController
- [ ] GroupTypeController

#### CI/CD Domain (6 controllers)

- [ ] ReleaseController
- [ ] WorkflowRunController
- [ ] WorkflowJobController
- [ ] WorkflowCommitController

#### Lookup/Enum Controllers (14+ controllers)

- [ ] ApiStatusController
- [ ] ApiTypeController
- [ ] BusinessCapabilityController
- [ ] etc.

#### Relationship/Nested Controllers (12+ controllers)

- [ ] ComponentApiController
- [ ] ComponentSystemController
- [ ] BusinessDomainComponentController
- [ ] BusinessDomainEntityController
- [ ] BusinessCapabilitySystemController
- [ ] ClusterServiceAccountController
- [ ] ClusterNodeController
- [ ] EntityAttributeController (nested)
- [ ] RoleController
- [ ] etc.

### Coverage Verification Steps

1. **Start the application:**

    ```bash
    docker compose -f docker-compose.full.yml up -d
    ```

2. **Access Scramble UI:**

    ```
    http://localhost:8080/docs/api
    ```

3. **Verify all tags are present:**
    - Catalog
    - Architecture
    - Infrastructure
    - Operations
    - Organization
    - CI/CD
    - Security
    - (etc.)

4. **Test interactive Try-It feature:**
    - Authenticate with Bearer token
    - Execute sample requests
    - Verify responses match documentation

5. **Export OpenAPI spec:**

    ```bash
    docker compose -f docker-compose.full.yml exec app php artisan scramble:export api.json
    ```

6. **Validate spec syntax:**
    ```bash
    # Using OpenAPI Validator online or CLI tool
    npx @redocly/openapi-cli lint api.json
    ```

---

## 4. Scramble Free vs Pro Evaluation

### Why Scramble Pro Might Be Needed

**Requirement from Task 1.3:** Webhook documentation

The implementation plan specifies:

- Webhooks for Jenkins deployments
- GitHub Actions integration (future)
- Need to document webhook payloads and signatures

**Feature Comparison:**

| Feature           | Free | Pro | Impact on Atlas                                                 |
| ----------------- | ---- | --- | --------------------------------------------------------------- |
| Auto-generation   | ✅   | ✅  | No difference                                                   |
| Response examples | ❌   | ✅  | Nice-to-have; currently compensated by Resource/Factory classes |
| Webhook docs      | ❌   | ✅  | **Required** for Task 1.3 implementation                        |
| API versioning    | ❌   | ✅  | Not needed (single v1 currently)                                |
| Custom UI themes  | ❌   | ✅  | Not needed                                                      |
| Priority support  | ❌   | ✅  | For enterprise use                                              |

**Cost:** [Check Scramble pricing](https://scramble.dedoc.co/pricing)

### Recommendation

**For v1.0 Launch (now):**

- ✅ Use Scramble Free
- ✅ Use comprehensive PHPDoc annotations
- ✅ Export spec for CI/CD validation

**For v1.1+ (post-launch):**

- 📋 Evaluate Scramble Pro if:
    - Webhook documentation becomes critical blocker
    - Team prefers built-in response examples
    - External API consumers request advanced features
- Alternative: Implement webhook docs manually or via custom Scramble plugin

**Current Plan:**

1. Complete Task 9.2 with Free tier
2. Test webhook documentation needs in PR review
3. Defer Pro decision to Sprint .next decision

---

## 5. Implementation Timeline

| Task    | Subtask                         | Effort   | Owner    | Status         |
| ------- | ------------------------------- | -------- | -------- | -------------- |
| 9.1.1   | Delete manual spec              | ✅       | Done     | ✅ Complete    |
| 9.1.2   | Update README                   | ✅       | Done     | ✅ Complete    |
| 9.1.3   | Verify Scramble generation      | 1h       | Testing  | 🔄 In Progress |
| 9.1.4   | Document /docs/api URL          | ✅       | Done     | ✅ Complete    |
| 9.1.5   | Evaluate Free vs Pro            | 30 min   | Review   | ⏳ Next        |
| 9.1.6   | Plan Pro adoption               | 15 min   | Docs     | ⏳ Next        |
| **9.2** | **Annotate 7 core controllers** | **2-3h** | **Code** | **Next**       |
| 9.3     | Verify all 61 endpoints         | 1h       | Testing  | ⏳ After 9.2   |

---

## 6. Files Modified

- ✅ Deleted: `docs/api/v1.0.0.yml` (manual spec)
- ✅ Updated: `README.md` (added API Documentation section)
- ✅ Config: `src/config/scramble.php` (already optimal)
- Pending: 7+ controller files (PHPDoc annotations)
- Pending: Possible `docs/WEBHOOK_DOCUMENTATION.md` (for Task 1.3)

---

## 7. References

- [Scramble Documentation](https://scramble.dedoc.co/)
- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Laravel PHPDoc Best Practices](https://laravel.com/docs/routing#controller-layouts)
- [Atlas Catalog Implementation Plan - Task 9](../plans/2026-03-04-backend-implementation-plan.md#9-épica-9--sincronización-de-api-spec)

---

## Next Steps

1. ✅ Review and approve this strategy document
2. 🔄 Complete Task 9.1 remaining subtasks (9.1.3, 9.1.5, 9.1.6)
3. Start Task 9.2: Annotate 7 core controllers
4. Run Scramble verification in Task 9.3
5. Consider Task 9.4 (optional): Webhook documentation improvements
