<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreSystemRequest;
use App\Http\Requests\UpdateSystemRequest;
use App\Http\Resources\SystemResource;
use App\Http\Resources\SystemResourceCollection;
use App\Models\System;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SystemController extends Controller
{
    use AllowedRelationships;

    public const array ALLOWED_RELATIONSHIPS = [
        'components',
        'businessCapabilities',
        'owner',
        'creator',
        'updater',
    ];

    /**
     * List all systems with optional filtering, searching, and pagination.
     *
     * Retrieve a paginated list of business systems that aggregate related components and capabilities.
     * Results can be filtered, searched, and sorted using query parameters.
     *
     * **Query Parameters:**
     * - `filter[field]=value` - Filter by field value
     * - `search=term` - Full-text search across system name and description
     * - `sort=field` or `sort=-field` - Sort by field (add `-` for descending)
     * - `with=relation1,relation2` - Eager-load relationships (components, businessCapabilities, owner, creator, updater)
     * - `per_page=25` - Items per page (default: 15, max: 100)
     *
     * @operationId listSystems
     * @response 200 Successfully retrieved paginated list of systems
     * @response 401 Unauthenticated - Missing or invalid authentication token
     * @response 403 Unauthorized - Insufficient permissions to list systems
     * @return SystemResourceCollection
     */
    public function index(Request $request): SystemResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new SystemResourceCollection(
            System::query()
                ->filter($request)
                ->search($request)
                ->sort($request)
                ->with($relationships)
                ->paginate()
        );
    }

    /**
     * Create a new business system.
     *
     * Register a new system that aggregates multiple components and business capabilities.
     * A system represents a cohesive unit of business functionality.
     *
     * **Request Body:**
     * - `name` (required, string, 255 chars) - System name
     * - `slug` (optional, string) - URL slug (auto-generated if not provided)
     * - `description` (required, string, 1000 chars) - System description and purpose
     * - `owner_id` (optional, UUID) - Organization group that owns this system
     *
     * @operationId createSystem
     * @response 201 System created successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Insufficient permissions
     * @response 422 Validation errors
     * @param StoreSystemRequest $request
     * @return SystemResource
     */
    public function store(StoreSystemRequest $request): SystemResource
    {
        $model = System::create($request->validated());

        return new SystemResource($model);
    }

    /**
     * Retrieve a specific system by ID or slug.
     *
     * Fetch detailed information about a single system, including its components and business capabilities.
     *
     * @operationId getSystem
     * @response 200 System retrieved successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 System not found
     * @param System $system System instance (resolved via route model binding)
     * @return SystemResource
     */
    public function show(System $system): SystemResource
    {
        return new SystemResource($system);
    }

    /**
     * Update an existing system.
     *
     * Modify system properties such as name, description, or ownership.
     *
     * @operationId updateSystem
     * @response 200 System updated successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Not creator or insufficient permissions
     * @response 404 System not found
     * @response 422 Validation errors
     * @param UpdateSystemRequest $request
     * @param System $system
     * @return SystemResource
     */
    public function update(UpdateSystemRequest $request, System $system): SystemResource
    {
        $model = $system->update($request->validated());

        return new SystemResource($model);
    }

    /**
     * Delete a system from the catalog.
     *
     * Permanently remove a system and all its associations. Only the creator or admin can delete.
     *
     * @operationId deleteSystem
     * @response 204 System deleted successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 System not found
     * @param System $system
     * @return Response
     */
    public function destroy(System $system): Response
    {
        $system->delete();

        return response()->noContent();
    }
}
