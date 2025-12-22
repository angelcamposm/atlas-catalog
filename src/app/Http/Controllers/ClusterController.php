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
     * Display a listing of the resource.
     *
     * @param  Request  $request
     *
     * @return ClusterResourceCollection
     */
    public function index(Request $request): ClusterResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new ClusterResourceCollection(Cluster::with($relationships)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreClusterRequest $request
     *
     * @return ClusterResource
     */
    public function store(StoreClusterRequest $request): ClusterResource
    {
        $model = Cluster::create($request->validated());

        return new ClusterResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request  $request
     * @param  Cluster  $cluster
     *
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
     * Update the specified resource in storage.
     *
     * @param UpdateClusterRequest $request
     * @param Cluster $cluster
     *
     * @return ClusterResource
     */
    public function update(UpdateClusterRequest $request, Cluster $cluster): ClusterResource
    {
        $model = $cluster->update($request->validated());

        return new ClusterResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Cluster $cluster
     *
     * @return Response
     */
    public function destroy(Cluster $cluster): Response
    {
        $cluster->delete();

        return response()->noContent();
    }
}
