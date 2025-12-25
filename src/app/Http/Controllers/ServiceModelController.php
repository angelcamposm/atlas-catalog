<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceModelRequest;
use App\Http\Requests\UpdateServiceModelRequest;
use App\Http\Resources\ServiceModelResource;
use App\Http\Resources\ServiceModelResourceCollection;
use App\Models\ServiceModel;
use Illuminate\Http\Response;

class ServiceModelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ServiceModelResourceCollection
     */
    public function index(): ServiceModelResourceCollection
    {
        return new ServiceModelResourceCollection(ServiceModel::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreServiceModelRequest $request
     *
     * @return ServiceModelResource
     */
    public function store(StoreServiceModelRequest $request): ServiceModelResource
    {
        $model = ServiceModel::create($request->validated());

        return new ServiceModelResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ServiceModel $serviceModel
     *
     * @return ServiceModelResource
     */
    public function show(ServiceModel $serviceModel): ServiceModelResource
    {
        return new ServiceModelResource($serviceModel);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateServiceModelRequest $request
     * @param ServiceModel $serviceModel
     *
     * @return ServiceModelResource
     */
    public function update(UpdateServiceModelRequest $request, ServiceModel $serviceModel): ServiceModelResource
    {
        $model = $serviceModel->update($request->validated());

        return new ServiceModelResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ServiceModel $serviceModel
     *
     * @return Response
     */
    public function destroy(ServiceModel $serviceModel): Response
    {
        $serviceModel->delete();

        return response()->noContent();
    }
}
