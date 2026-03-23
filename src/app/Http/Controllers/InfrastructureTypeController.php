<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreInfrastructureTypeRequest;
use App\Http\Requests\UpdateInfrastructureTypeRequest;
use App\Http\Resources\InfrastructureTypeResource;
use App\Http\Resources\InfrastructureTypeResourceCollection;
use App\Models\InfrastructureType;
use Illuminate\Http\Response;

class InfrastructureTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return InfrastructureTypeResourceCollection
     */
    public function index(): InfrastructureTypeResourceCollection
    {
        return new InfrastructureTypeResourceCollection(InfrastructureType::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreInfrastructureTypeRequest $request
     *
     * @return InfrastructureTypeResource
     */
    public function store(StoreInfrastructureTypeRequest $request): InfrastructureTypeResource
    {
        $model = InfrastructureType::create($request->validated());

        return new InfrastructureTypeResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param InfrastructureType $infrastructure_type
     *
     * @return InfrastructureTypeResource
     */
    public function show(InfrastructureType $infrastructure_type): InfrastructureTypeResource
    {
        return new InfrastructureTypeResource($infrastructure_type);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateInfrastructureTypeRequest $request
     * @param InfrastructureType $infrastructure_type
     *
     * @return InfrastructureTypeResource
     */
    public function update(UpdateInfrastructureTypeRequest $request, InfrastructureType $infrastructure_type): InfrastructureTypeResource
    {
        $model = tap($infrastructure_type)->update($request->validated());

        return new InfrastructureTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param InfrastructureType $infrastructure_type
     *
     * @return Response
     */
    public function destroy(InfrastructureType $infrastructure_type): Response
    {
        $infrastructure_type->delete();

        return response()->noContent();
    }
}
