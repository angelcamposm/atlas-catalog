<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreClusterServiceAccountRequest;
use App\Http\Requests\UpdateClusterServiceAccountRequest;
use App\Http\Resources\ClusterServiceAccountResource;
use App\Http\Resources\ClusterServiceAccountResourceCollection;
use App\Models\ClusterServiceAccount;
use Illuminate\Http\Response;

class ClusterServiceAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ClusterServiceAccountResourceCollection
     */
    public function index(): ClusterServiceAccountResourceCollection
    {
        return new ClusterServiceAccountResourceCollection(ClusterServiceAccount::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreClusterServiceAccountRequest $request
     *
     * @return ClusterServiceAccountResource
     */
    public function store(StoreClusterServiceAccountRequest $request): ClusterServiceAccountResource
    {
        $model = ClusterServiceAccount::create($request->validated());

        return new ClusterServiceAccountResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ClusterServiceAccount $clusterServiceAccount
     *
     * @return ClusterServiceAccountResource
     */
    public function show(ClusterServiceAccount $clusterServiceAccount): ClusterServiceAccountResource
    {
        return new ClusterServiceAccountResource($clusterServiceAccount);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateClusterServiceAccountRequest $request
     * @param ClusterServiceAccount $clusterServiceAccount
     *
     * @return ClusterServiceAccountResource
     */
    public function update(UpdateClusterServiceAccountRequest $request, ClusterServiceAccount $clusterServiceAccount): ClusterServiceAccountResource
    {
        $model = $clusterServiceAccount->update($request->validated());

        return new ClusterServiceAccountResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ClusterServiceAccount $clusterServiceAccount
     *
     * @return Response
     */
    public function destroy(ClusterServiceAccount $clusterServiceAccount): Response
    {
        $clusterServiceAccount->delete();

        return response()->noContent();
    }
}
