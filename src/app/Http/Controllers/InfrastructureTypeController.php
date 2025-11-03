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
     * @param InfrastructureType $infrastructureType
     *
     * @return InfrastructureTypeResource
     */
    public function show(InfrastructureType $infrastructureType): InfrastructureTypeResource
    {
        return new InfrastructureTypeResource($infrastructureType);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateInfrastructureTypeRequest $request
     * @param InfrastructureType $infrastructureType
     *
     * @return InfrastructureTypeResource
     */
    public function update(UpdateInfrastructureTypeRequest $request, InfrastructureType $infrastructureType): InfrastructureTypeResource
    {
        $model = $infrastructureType->update($request->validated());

        return new InfrastructureTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param InfrastructureType $infrastructureType
     *
     * @return Response
     */
    public function destroy(InfrastructureType $infrastructureType): Response
    {
        $infrastructureType->delete();

        return response()->noContent();
    }
}
