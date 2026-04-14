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
     * @param ServiceStatus $service_status
     *
     * @return ServiceStatusResource
     */
    public function show(ServiceStatus $service_status): ServiceStatusResource
    {
        return new ServiceStatusResource($service_status);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateServiceStatusRequest $request
     * @param ServiceStatus $service_status
     *
     * @return ServiceStatusResource
     */
    public function update(UpdateServiceStatusRequest $request, ServiceStatus $service_status): ServiceStatusResource
    {
        $model = tap($service_status)->update($request->validated());

        return new ServiceStatusResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ServiceStatus $service_status
     *
     * @return Response
     */
    public function destroy(ServiceStatus $service_status): Response
    {
        $service_status->delete();

        return response()->noContent();
    }
}
