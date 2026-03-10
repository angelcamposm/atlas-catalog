<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreClusterRequest;
use App\Http\Requests\UpdateClusterRequest;
use App\Http\Resources\ClusterResource;
use App\Http\Resources\ClusterResourceCollection;
use App\Models\Cluster;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClusterController extends Controller
{
    use AllowedRelationships;

    /**
     * List of relationships that can be eagerly loaded with cluster resources.
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'infrastructure_type',
        'lifecycle',
        'nodes',
        'service_accounts',
        'type',
        'updater',
    ];

    /**
     * List all Kubernetes/infrastructure clusters with filtering and pagination.
     *
     * Retrieve a paginated list of compute clusters (EKS, GKE, AKS, OpenShift, etc.)
     * configured in your infrastructure.
     *
     * **Query Parameters:**
     * - `filter[field]=value` - Filter by field (e.g., ?filter[type_id]=eks)
     * - `search=term` - Search cluster name and description
     * - `sort=field` or `sort=-field` - Sort by field (add `-` for descending)
     * - `with=relation1,relation2` - Eager-load (creator, infrastructure_type, lifecycle, nodes, service_accounts, type, updater)
     * - `per_page=25` - Items per page (default: 15, max: 100)
     *
     * @operationId listClusters
     * @response 200 Successfully retrieved paginated list of clusters
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @param  Request  $request
     * @return ClusterResourceCollection
     */
    public function index(Request $request): ClusterResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new ClusterResourceCollection(
            Cluster::query()
                ->filter($request)
                ->search($request)
                ->sort($request)
                ->with($relationships)
                ->paginate()
        );
    }

    /**
     * Register a new Kubernetes cluster.
     *
     * Create a new cluster entry for infrastructure orchestration. Requires cluster name, type (EKS, GKE, etc.),
     * and infrastructure type classification.
     *
     * **Request Body:**
     * - `name` (required, string, 255 chars) - Cluster name
     * - `slug` (optional, string) - URL slug
     * - `description` (optional, string) - Cluster description
     * - `cluster_type_id` (required, UUID) - Type (EKS, GKE, AKS, OpenShift, etc.)
     * - `infrastructure_type_id` (optional, UUID) - Infrastructure classification
     * - `lifecycle_phase_id` (optional, UUID) - Lifecycle phase (development, production, etc.)
     *
     * @operationId createCluster
     * @response 201 Cluster created successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 422 Validation errors
     * @param StoreClusterRequest $request
     * @return ClusterResource
     */
    public function store(StoreClusterRequest $request): ClusterResource
    {
        $model = Cluster::create($request->validated());

        return new ClusterResource($model);
    }

    /**
     * Retrieve a specific cluster by ID or slug.
     *
     * Fetch detailed information about a single cluster, including its nodes and service accounts.
     *
     * **Query Parameters:**
     * - `with=relation1,relation2` - Eager-load relationships
     *
     * @operationId getCluster
     * @response 200 Cluster retrieved successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 Cluster not found
     * @param  Request  $request
     * @param  Cluster  $cluster
     * @return ClusterResource
     */
    public function show(Request $request, Cluster $cluster): ClusterResource
    {
        if ($request->has('with')) {
            $requestedRelationships = $request->get('with');
            $cluster->load(self::filterAllowedRelationships($requestedRelationships));
        }

        return new ClusterResource($cluster);
    }

    /**
     * Update an existing cluster.
     *
     * Modify cluster properties like name, type, or lifecycle phase.
     *
     * @operationId updateCluster
     * @response 200 Cluster updated successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 Cluster not found
     * @response 422 Validation errors
     * @param UpdateClusterRequest $request
     * @param Cluster $cluster
     * @return ClusterResource
     */
    public function update(UpdateClusterRequest $request, Cluster $cluster): ClusterResource
    {
        $model = tap($cluster)->update($request->validated());

        return new ClusterResource($model);
    }

    /**
     * Delete a cluster from the catalog.
     *
     * Permanently remove a cluster entry and all its associations.
     *
     * @operationId deleteCluster
     * @response 204 Cluster deleted successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 Cluster not found
     * @param Cluster $cluster
     * @return Response
     */
    public function destroy(Cluster $cluster): Response
    {
        $cluster->delete();

        return response()->noContent();
    }
}
