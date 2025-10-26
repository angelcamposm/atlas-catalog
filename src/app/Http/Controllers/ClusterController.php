<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreClusterRequest;
use App\Http\Requests\UpdateClusterRequest;
use App\Http\Resources\ClusterResource;
use App\Http\Resources\ClusterResourceCollection;
use App\Models\Cluster;
use Illuminate\Http\Response;

class ClusterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ClusterResourceCollection
     */
    public function index(): ClusterResourceCollection
    {
        return new ClusterResourceCollection(Cluster::paginate());
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
     * @param Cluster $cluster
     *
     * @return ClusterResource
     */
    public function show(Cluster $cluster): ClusterResource
    {
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
