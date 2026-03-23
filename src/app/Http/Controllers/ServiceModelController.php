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

        return new ServiceModelResourceCollection(
            ServiceModel::filter($request)
                ->search($request)
                ->sort($request)
                ->with($requestedRelationships)
                ->paginate()
        );
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
     * @param  ServiceModel  $service_model
     *
     * @return ServiceModelResource
     */
    public function show(Request $request, ServiceModel $service_model): ServiceModelResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $service_model->load($allowedRelationships);
        }

        return new ServiceModelResource($service_model);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateServiceModelRequest $request
     * @param ServiceModel $service_model
     *
     * @return ServiceModelResource
     */
    public function update(UpdateServiceModelRequest $request, ServiceModel $service_model): ServiceModelResource
    {
        $model = tap($service_model)->update($request->validated());

        return new ServiceModelResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ServiceModel $service_model
     *
     * @return Response
     */
    public function destroy(ServiceModel $service_model): Response
    {
        $service_model->delete();

        return response()->noContent();
    }
}
