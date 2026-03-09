<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeploymentRequest;
use App\Http\Requests\UpdateDeploymentRequest;
use App\Http\Resources\DeploymentResource;
use App\Http\Resources\DeploymentResourceCollection;
use App\Models\Deployment;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class DeploymentController extends Controller
{
    use AllowedRelationships;

    public const array ALLOWED_RELATIONSHIPS = [
        'component',
        'environment',
        'cluster',
        'release',
        'workflowRun',
        'triggerer',
    ];

    /**
     * List all deployments with optional filtering and pagination.
     *
     * Retrieve a paginated list of deployments (component releases to environments/clusters).
     * Includes deployment status, duration, and related resources (component, environment, cluster).
     *
     * **Query Parameters:**
     * - `filter[field]=value` - Filter by status, cluster, environment
     * - `search=term` - Search deployment metadata
     * - `sort=field` or `sort=-field` - Sort by field (add `-` for descending)
     * - `with=relation1,relation2` - Eager-load (component, environment, cluster, release, workflowRun, triggerer)
     * - `per_page=25` - Items per page (default: 15, max: 100)
     *
     * @operationId listDeployments
     * @response 200 Successfully retrieved paginated list of deployments
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @return DeploymentResourceCollection
     */
    public function index(Request $request): DeploymentResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new DeploymentResourceCollection(
            Deployment::with($relationships)->paginate()
        );
    }

    /**
     * Create a new deployment record.
     *
     * Register a new deployment of a component release to a specific environment and cluster.
     * The `started_at` timestamp is automatically set to the current time if not provided.
     * Used for tracking deployment progression from start to completion.
     *
     * **Request Body:**
     * - `component_id` (required, UUID) - Component being deployed
     * - `release_id` (required, UUID) - Release version being deployed
     * - `environment_id` (required, UUID) - Target environment (dev, staging, prod, etc.)
     * - `cluster_id` (required, UUID) - Target cluster
     * - `status` (required, string) - Deployment status (pending, in_progress, completed, failed)
     * - `started_at` (optional, datetime) - Deployment start time (auto-set to now if omitted)
     * - `meta` (optional, object) - Additional metadata (build info, flags, etc.)
     *
     * @operationId createDeployment
     * @response 201 Deployment created successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 422 Validation errors
     * @param StoreDeploymentRequest  $request
     * @return DeploymentResource
     */
    public function store(StoreDeploymentRequest $request): DeploymentResource
    {
        $data = $request->validated();

        if (!isset($data['started_at'])) {
            $data['started_at'] = Carbon::now();
        }

        $deployment = Deployment::create($data);

        return new DeploymentResource($deployment);
    }

    /**
     * Retrieve a specific deployment.
     *
     * Fetch detailed information about a single deployment, including status, duration,
     * and associated component, release, environment, and cluster.
     *
     * @operationId getDeployment
     * @response 200 Deployment retrieved successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 Deployment not found
     * @param Deployment $deployment
     * @return DeploymentResource
     */
    public function show(Deployment $deployment): DeploymentResource
    {
        return new DeploymentResource($deployment);
    }

    /**
     * Update a deployment record (typically marking as completed).
     *
     * Modify deployment status and end time. The system automatically calculates `duration_milliseconds`
     * from `started_at` to `ended_at`. If `ended_at` is not provided, it defaults to current time.
     * The `meta` field is merged (not replaced) if both old and new values exist.
     *
     * **Request Body:** All fields optional
     * - `status` (optional, string) - Update status (e.g., pending → completed, in_progress → completed)
     * - `ended_at` (optional, datetime) - Deployment end time (auto-set to now if omitted)
     * - `meta` (optional, object) - Additional metadata to merge with existing
     *
     * **Auto-calculated Fields:**
     * - `duration_milliseconds` - Calculated as time between started_at and ended_at
     *
     * @operationId updateDeployment
     * @response 200 Deployment updated successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Not triggerer or insufficient permissions
     * @response 404 Deployment not found
     * @response 422 Validation errors
     * @param  UpdateDeploymentRequest  $request
     * @param  Deployment               $deployment
     *
     * @return DeploymentResource
     */
    public function update(UpdateDeploymentRequest $request, Deployment $deployment): DeploymentResource
    {
        $data = $request->validated();

        $endedAt = isset($data['ended_at'])
            ? Carbon::parse($data['ended_at'])
            : Carbon::now();

        $data['ended_at'] = $endedAt;

        // Calculate duration
        if ($deployment->started_at) {
            $data['duration_milliseconds'] = $deployment->started_at->diffInMilliseconds($endedAt);
        }

        // Merge meta if exists
        if (isset($data['meta']) && $deployment->meta) {
            $data['meta'] = array_merge($deployment->meta, $data['meta']);
        }

        $deployment->update($data);

        return new DeploymentResource($deployment);
    }

    /**
     * Delete a deployment record.
     *
     * Remove a deployment record from the system. Used for cleaning up test deployments or erroneous entries.
     *
     * @operationId deleteDeployment
     * @response 204 Deployment deleted successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 Deployment not found
     * @param Deployment $deployment
     * @return Response
     */
    public function destroy(Deployment $deployment): Response
    {
        $deployment->delete();

        return response()->noContent();
    }
}
