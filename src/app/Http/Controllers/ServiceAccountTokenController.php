<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceAccountTokenRequest;
use App\Http\Requests\UpdateServiceAccountTokenRequest;
use App\Http\Resources\ServiceAccountTokenResource;
use App\Http\Resources\ServiceAccountTokenResourceCollection;
use App\Models\ServiceAccountToken;
use Illuminate\Http\Response;

class ServiceAccountTokenController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ServiceAccountTokenResourceCollection
     */
    public function index(): ServiceAccountTokenResourceCollection
    {
        return new ServiceAccountTokenResourceCollection(ServiceAccountToken::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreServiceAccountTokenRequest $request
     *
     * @return ServiceAccountTokenResource
     */
    public function store(StoreServiceAccountTokenRequest $request): ServiceAccountTokenResource
    {
        $model = ServiceAccountToken::create($request->validated());

        return new ServiceAccountTokenResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ServiceAccountToken $serviceAccountToken
     *
     * @return ServiceAccountTokenResource
     */
    public function show(ServiceAccountToken $serviceAccountToken): ServiceAccountTokenResource
    {
        return new ServiceAccountTokenResource($serviceAccountToken);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateServiceAccountTokenRequest $request
     * @param ServiceAccountToken $serviceAccountToken
     *
     * @return ServiceAccountTokenResource
     */
    public function update(UpdateServiceAccountTokenRequest $request, ServiceAccountToken $serviceAccountToken): ServiceAccountTokenResource
    {
        $model = $serviceAccountToken->update($request->validated());

        return new ServiceAccountTokenResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ServiceAccountToken $serviceAccountToken
     *
     * @return Response
     */
    public function destroy(ServiceAccountToken $serviceAccountToken): Response
    {
        $serviceAccountToken->delete();

        return response()->noContent();
    }
}
