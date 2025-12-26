<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceModelRequest;
use App\Http\Requests\UpdateServiceModelRequest;
use App\Http\Resources\ServiceModelResource;
use App\Http\Resources\ServiceModelResourceCollection;
use App\Models\ServiceModel;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ServiceModelController extends Controller
{
    use AllowedRelationships;

    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'updater',
    ];

    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     *
     * @return ServiceModelResourceCollection
     */
    public function index(Request $request): ServiceModelResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new ServiceModelResourceCollection(ServiceModel::with($requestedRelationships)->paginate());
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
     * @param  Request       $request
     * @param  ServiceModel  $serviceModel
     *
     * @return ServiceModelResource
     */
    public function show(Request $request, ServiceModel $serviceModel): ServiceModelResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $serviceModel->load($allowedRelationships);
        }

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
