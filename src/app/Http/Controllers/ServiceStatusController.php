<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceStatusRequest;
use App\Http\Requests\UpdateServiceStatusRequest;
use App\Http\Resources\ServiceStatusResource;
use App\Http\Resources\ServiceStatusResourceCollection;
use App\Models\ServiceStatus;
use Illuminate\Http\Response;

class ServiceStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ServiceStatusResourceCollection
     */
    public function index(): ServiceStatusResourceCollection
    {
        return new ServiceStatusResourceCollection(ServiceStatus::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreServiceStatusRequest $request
     *
     * @return ServiceStatusResource
     */
    public function store(StoreServiceStatusRequest $request): ServiceStatusResource
    {
        $model = ServiceStatus::create($request->validated());

        return new ServiceStatusResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ServiceStatus $serviceStatus
     *
     * @return ServiceStatusResource
     */
    public function show(ServiceStatus $serviceStatus): ServiceStatusResource
    {
        return new ServiceStatusResource($serviceStatus);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateServiceStatusRequest $request
     * @param ServiceStatus $serviceStatus
     *
     * @return ServiceStatusResource
     */
    public function update(UpdateServiceStatusRequest $request, ServiceStatus $serviceStatus): ServiceStatusResource
    {
        $model = $serviceStatus->update($request->validated());

        return new ServiceStatusResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ServiceStatus $serviceStatus
     *
     * @return Response
     */
    public function destroy(ServiceStatus $serviceStatus): Response
    {
        $serviceStatus->delete();

        return response()->noContent();
    }
}
