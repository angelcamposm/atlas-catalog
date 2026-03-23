<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceAccountRequest;
use App\Http\Requests\UpdateServiceAccountRequest;
use App\Http\Resources\ServiceAccountResource;
use App\Http\Resources\ServiceAccountResourceCollection;
use App\Models\ServiceAccount;
use Illuminate\Http\Response;

class ServiceAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ServiceAccountResourceCollection
     */
    public function index(): ServiceAccountResourceCollection
    {
        return new ServiceAccountResourceCollection(ServiceAccount::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreServiceAccountRequest $request
     *
     * @return ServiceAccountResource
     */
    public function store(StoreServiceAccountRequest $request): ServiceAccountResource
    {
        $model = ServiceAccount::create($request->validated());

        return new ServiceAccountResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ServiceAccount $service_account
     *
     * @return ServiceAccountResource
     */
    public function show(ServiceAccount $service_account): ServiceAccountResource
    {
        return new ServiceAccountResource($service_account);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateServiceAccountRequest $request
     * @param ServiceAccount $service_account
     *
     * @return ServiceAccountResource
     */
    public function update(UpdateServiceAccountRequest $request, ServiceAccount $service_account): ServiceAccountResource
    {
        $model = tap($service_account)->update($request->validated());

        return new ServiceAccountResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ServiceAccount $service_account
     *
     * @return Response
     */
    public function destroy(ServiceAccount $service_account): Response
    {
        $this->authorize('delete', $service_account);

        $service_account->delete();

        return response()->noContent();
    }
}
