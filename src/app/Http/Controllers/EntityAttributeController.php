<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreEntityAttributeRequest;
use App\Http\Requests\UpdateEntityAttributeRequest;
use App\Http\Resources\EntityAttributeResource;
use App\Http\Resources\EntityAttributeResourceCollection;
use App\Models\EntityAttribute;
use Illuminate\Http\Response;

class EntityAttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return EntityAttributeResourceCollection
     */
    public function index(): EntityAttributeResourceCollection
    {
        return new EntityAttributeResourceCollection(EntityAttribute::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreEntityAttributeRequest  $request
     *
     * @return EntityAttributeResource
     */
    public function store(StoreEntityAttributeRequest $request): EntityAttributeResource
    {
        $model = EntityAttribute::create($request->validated());

        return new EntityAttributeResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param EntityAttribute  $entityProperty
     *
     * @return EntityAttributeResource
     */
    public function show(EntityAttribute $entityProperty): EntityAttributeResource
    {
        return new EntityAttributeResource($entityProperty);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateEntityAttributeRequest  $request
     * @param EntityAttribute               $entityProperty
     *
     * @return EntityAttributeResource
     */
    public function update(UpdateEntityAttributeRequest $request, EntityAttribute $entityProperty): EntityAttributeResource
    {
        $model = $entityProperty->update($request->validated());

        return new EntityAttributeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param EntityAttribute  $entityProperty
     *
     * @return Response
     */
    public function destroy(EntityAttribute $entityProperty): Response
    {
        $entityProperty->delete();

        return response()->noContent();
    }
}
