<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreApiRequest;
use App\Http\Requests\UpdateApiRequest;
use App\Http\Resources\ApiResource;
use App\Http\Resources\ApiResourceCollection;
use App\Models\Api;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ApiController extends Controller
{
    use AllowedRelationships;

    /**
     * Defines the relationships that can be eager-loaded with API resources.
     *
     * This constant is used by the AllowedRelationships trait to filter and validate
     * relationships requested via the 'with' query parameter. Only relationships listed
     * here can be included when fetching API resources to prevent unauthorized data exposure.
     *
     * Available relationships:
     * - accessPolicy: The access policy associated with the API
     * - authenticationMethod: The authentication method required for the API
     * - category: The category classification of the API
     * - components: Components that use or provide this API
     * - creator: The user who created the API
     * - deprecator: The user who deprecated the API (if applicable)
     * - status: The current status of the API (e.g., active, inactive)
     * - type: The type classification of the API (e.g., REST, SOAP, GraphQL)
     * - updater: The user who last updated the API
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'accessPolicy',
        'authenticationMethod',
        'category',
        'components',
        'creator',
        'deprecator',
        'status',
        'type',
        'updater',
    ];

    /**
     * List all APIs with optional filtering, searching, and pagination.
     *
     * Retrieve a paginated list of APIs registered in the catalog. Results can be filtered by
     * status, type, category, and searched by name or description.
     *
     * **Query Parameters:**
     * - `filter[field]=value` - Filter by field (e.g., ?filter[status]=active)
     * - `search=term` - Search API name and description
     * - `sort=field` or `sort=-field` - Sort by field (add `-` for descending)
     * - `with=relation1,relation2` - Eager-load relationships
     * - `per_page=25` - Items per page (default: 15, max: 100)
     *
     * **Allowed Relationships:** accessPolicy, authenticationMethod, category, components, creator, deprecator, status, type, updater
     *
     * @operationId listApis
     * @response 200 Successfully retrieved paginated list of APIs
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Insufficient permissions
     * @return ApiResourceCollection
     */
    public function index(Request $request): ApiResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new ApiResourceCollection(
            Api::query()
                ->filter($request)
                ->search($request)
                ->sort($request)
                ->with($relationships)
                ->paginate()
        );
    }

    /**
     * Register a new API in the catalog.
     *
     * Create a new API entry with endpoint, type, authentication method, and status information.
     *
     * **Request Body:**
     * - `name` (required, string, 255 chars) - API name
     * - `slug` (optional, string) - URL slug (auto-generated if not provided)
     * - `description` (required, string) - API description
     * - `api_type_id` (required, UUID) - API type (REST, SOAP, GraphQL, etc.)
     * - `authentication_method_id` (optional, UUID) - Auth method (OAuth2, API Key, etc.)
     * - `status_id` (required, UUID) - Status (active, deprecated, inactive)
     * - `api_category_id` (optional, UUID) - Category classification
     * - `api_access_policy_id` (optional, UUID) - Access policy/routing
     * - `documentation_url` (optional, string, URL)
     * - `base_path` (optional, string) - API base path or endpoint
     *
     * @operationId createApi
     * @response 201 API created successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Insufficient permissions
     * @response 422 Validation errors
     * @param StoreApiRequest $request
     * @return ApiResource
     */
    public function store(StoreApiRequest $request): ApiResource
    {
        $model = Api::create($request->validated());

        return new ApiResource($model);
    }

    /**
     * Retrieve a specific API by ID or slug.
     *
     * Fetch detailed information about a single API, including optional eager-loaded relationships.
     *
     * @operationId getApi
     * @response 200 API retrieved successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 API not found
     * @param Request $request The incoming request
     * @param Api $api API instance (resolved via route model binding)
     * @return ApiResource
     */
    public function show(Request $request, Api $api): ApiResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $api->load($allowedRelationships);
        }

        return new ApiResource($api);
    }

    /**
     * Update an existing API.
     *
     * Modify API properties including name, description, type, authentication method, or status.
     *
     * @operationId updateApi
     * @response 200 API updated successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Not creator or insufficient permissions
     * @response 404 API not found
     * @response 422 Validation errors
     * @param UpdateApiRequest $request
     * @param Api $api
     * @return ApiResource
     */
    public function update(UpdateApiRequest $request, Api $api): ApiResource
    {
        $model = tap($api)->update($request->validated());

        return new ApiResource($model);
    }

    /**
     * Delete an API from the catalog.
     *
     * Remove an API entry. Only the creator or admin can delete.
     *
     * @operationId deleteApi
     * @response 204 API deleted successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 API not found
     * @param Api $api
     * @return Response
     */
    public function destroy(Api $api): Response
    {
        $this->authorize('delete', $api);

        $api->delete();

        return response()->noContent();
    }
}
