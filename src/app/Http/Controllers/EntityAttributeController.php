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
     * @param EntityAttribute  $attribute
     *
     * @return EntityAttributeResource
     */
    public function show(EntityAttribute $attribute): EntityAttributeResource
    {
        return new EntityAttributeResource($attribute);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateEntityAttributeRequest  $request
     * @param EntityAttribute               $attribute
     *
     * @return EntityAttributeResource
     */
    public function update(UpdateEntityAttributeRequest $request, EntityAttribute $attribute): EntityAttributeResource
    {
        $model = tap($attribute)->update($request->validated());

        return new EntityAttributeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param EntityAttribute  $attribute
     *
     * @return Response
     */
    public function destroy(EntityAttribute $attribute): Response
    {
        $attribute->delete();

        return response()->noContent();
    }
}
