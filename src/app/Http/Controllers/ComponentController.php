<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreComponentRequest;
use App\Http\Requests\UpdateComponentRequest;
use App\Http\Resources\ComponentResource;
use App\Http\Resources\ComponentResourceCollection;
use App\Models\Component;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ComponentController extends Controller
{
    use AllowedRelationships;

    /**
     * Defines the relationships that can be eager-loaded with Component resources.
     *
     * This constant is used by the AllowedRelationships trait to filter and validate
     * relationships requested via the 'with' query parameter. Only relationships listed
     * here can be included when fetching Component resources to prevent unauthorized data exposure.
     *
     * Available relationships:
     * - apis: APIs associated with this component
     * - creator: The user who created the component
     * - domain: The business domain of the component
     * - lifecyclePhases: The lifecycle phases of the component
     * - owner: The group that owns this component
     * - platform: The platform of the component
     * - status: The current status of the component
     * - systems: Systems that include this component
     * - tier: The business tier of the component
     * - updater: The user who last updated the component
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'apis',
        'creator',
        'domain',
        'lifecyclePhases',
        'owner',
        'platform',
        'status',
        'systems',
        'tier',
        'updater',
    ];
    /**
     * List all components with optional filtering, searching, and pagination.
     *
     * Retrieve a paginated list of software components in the catalog. Results can be filtered,
     * searched, and sorted using query parameters.
     *
     * **Query Parameters:**
     * - `filter[field]=value` - Filter by field value (e.g., ?filter[status_id]=active)
     * - `search=term` - Full-text search across component name and description
     * - `sort=field` or `sort=-field` - Sort by field (add `-` for descending)
     * - `with=relation1,relation2` - Eager-load relationships (see Allowed Relationships)
     * - `per_page=25` - Items per page (default: 15, max: 100)
     *
     * **Allowed Relationships:** apis, creator, domain, lifecyclePhases, owner, platform, status, systems, tier, updater
     *
     * @operationId listComponents
     * @response 200 Successfully retrieved paginated list of components
     * @response 401 Unauthenticated - Missing or invalid authentication token
     * @response 403 Unauthorized - Insufficient permissions to list components
     * @return ComponentResourceCollection
     */
    public function index(Request $request): ComponentResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new ComponentResourceCollection(
            Component::query()
                ->filter($request)
                ->search($request)
                ->sort($request)
                ->with($relationships)
                ->paginate()
        );
    }

    /**
     * Create a new component in the catalog.
     *
     * Register a new software component with platform, domain, and status information.
     * The component will be associated with the authenticated user as creator.
     *
     * **Request Body:**
     * - `name` (required, string, 255 chars max) - Component name
     * - `slug` (optional, string) - URL-friendly slug (auto-generated from name if not provided)
     * - `description` (required, string, 1000 chars max) - Detailed component description
     * - `status_id` (required, UUID) - Initial status (typically "active")
     * - `platform_id` (required, UUID) - Platform the component runs on (EKS, GKE, etc.)
     * - `domain_id` (optional, UUID) - Business domain association
     * - `lifecycle_phase_id` (optional, UUID) - Development lifecycle phase
     * - `owner_id` (optional, UUID) - Group or team that owns this component
     * - `tier_id` (optional, UUID) - Business tier classification
     *
     * @operationId createComponent
     * @response 201 Component created successfully - returns ComponentResource
     * @response 400 Validation failed - check response for errors
     * @response 401 Unauthenticated - Missing or invalid authentication token
     * @response 403 Unauthorized - Insufficient permissions to create component
     * @response 422 Unprocessable entity - Validation errors on fields
     * @param StoreComponentRequest $request Validated component data
     * @return ComponentResource
     */
    public function store(StoreComponentRequest $request): ComponentResource
    {
        $model = Component::create($request->validated());

        return new ComponentResource($model);
    }

    /**
     * Retrieve a specific component by ID or slug.
     *
     * Fetch detailed information about a single component, including optional eager-loaded relationships.
     *
     * **Path Parameters:**
     * - `component` (required, string) - Component ID or slug (case-insensitive for slug)
     *
     * **Query Parameters:**
     * - `with=relation1,relation2` - Eager-load relationships (see Allowed Relationships)
     *
     * @operationId getComponent
     * @response 200 Component retrieved successfully
     * @response 401 Unauthenticated - Missing or invalid authentication token
     * @response 403 Unauthorized - Insufficient permissions to view component
     * @response 404 Component not found
     * @param Request $request The incoming request containing optional 'with' parameter
     * @param Component $component Component instance (resolved via route model binding)
     * @return ComponentResource
     */
    public function show(Request $request, Component $component): ComponentResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $component->load($allowedRelationships);
        }

        return new ComponentResource($component);
    }

    /**
     * Update an existing component.
     *
     * Modify component properties such as name, description, status, platform, or relationships.
     * Only the authenticated user (creator) or admin can update the component.
     *
     * **Path Parameters:**
     * - `component` (required, string) - Component ID or slug
     *
     * **Request Body:** All fields optional - only include fields to update
     * - `name` (optional, string, 255 chars max)
     * - `slug` (optional, string)
     * - `description` (optional, string, 1000 chars max)
     * - `status_id` (optional, UUID)
     * - `platform_id` (optional, UUID)
     * - `domain_id` (optional, UUID)
     * - `tier_id` (optional, UUID)
     * - `owner_id` (optional, UUID)
     *
     * @operationId updateComponent
     * @response 200 Component updated successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Not the creator or insufficient permissions
     * @response 404 Component not found
     * @response 422 Validation errors
     * @param UpdateComponentRequest $request Validated component update data
     * @param Component $component Component to update
     * @return ComponentResource
     */
    public function update(UpdateComponentRequest $request, Component $component): ComponentResource
    {
        $model = tap($component)->update($request->validated());

        return new ComponentResource($model);
    }

    /**
     * Delete a component from the catalog.
     *
     * Permanently remove a component and all its associations. Only the creator or admin can delete.
     * This action is typically soft-delete (archive) to preserve audit history.
     *
     * **Path Parameters:**
     * - `component` (required, string) - Component ID or slug
     *
     * @operationId deleteComponent
     * @response 204 Component deleted successfully - no content returned
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Not the creator or insufficient permissions
     * @response 404 Component not found
     * @param Component $component Component to delete
     * @return Response HTTP 204 No Content
     */
    public function destroy(Component $component): Response
    {
        $component->delete();

        return response()->noContent();
    }
}
