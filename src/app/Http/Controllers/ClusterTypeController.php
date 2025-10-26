<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreClusterTypeRequest;
use App\Http\Requests\UpdateClusterTypeRequest;
use App\Http\Resources\ClusterTypeResource;
use App\Http\Resources\ClusterTypeResourceCollection;
use App\Models\ClusterType;
use Illuminate\Http\Response;

class ClusterTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ClusterTypeResourceCollection
     */
    public function index(): ClusterTypeResourceCollection
    {
        return new ClusterTypeResourceCollection(ClusterType::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreClusterTypeRequest $request
     *
     * @return ClusterTypeResource
     */
    public function store(StoreClusterTypeRequest $request): ClusterTypeResource
    {
        $model = ClusterType::create($request->validated());

        return new ClusterTypeResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ClusterType $clusterType
     *
     * @return ClusterTypeResource
     */
    public function show(ClusterType $clusterType): ClusterTypeResource
    {
        return new ClusterTypeResource($clusterType);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateClusterTypeRequest $request
     * @param ClusterType $clusterType
     *
     * @return ClusterTypeResource
     */
    public function update(UpdateClusterTypeRequest $request, ClusterType $clusterType): ClusterTypeResource
    {
        $model = $clusterType->update($request->validated());

        return new ClusterTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ClusterType $clusterType
     *
     * @return Response
     */
    public function destroy(ClusterType $clusterType): Response
    {
        $clusterType->delete();

        return response()->noContent();
    }
}
