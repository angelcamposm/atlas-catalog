<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreComponentTypeRequest;
use App\Http\Requests\UpdateComponentTypeRequest;
use App\Http\Resources\ComponentTypeResource;
use App\Http\Resources\ComponentTypeResourceCollection;
use App\Models\ComponentType;
use Illuminate\Http\Response;

class ComponentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ComponentTypeResourceCollection
     */
    public function index(): ComponentTypeResourceCollection
    {
        return new ComponentTypeResourceCollection(ComponentType::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreComponentTypeRequest $request
     *
     * @return ComponentTypeResource
     */
    public function store(StoreComponentTypeRequest $request): ComponentTypeResource
    {
        $model = ComponentType::create($request->validated());

        return new ComponentTypeResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ComponentType $componentType
     *
     * @return ComponentTypeResource
     */
    public function show(ComponentType $componentType): ComponentTypeResource
    {
        return new ComponentTypeResource($componentType);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateComponentTypeRequest $request
     * @param ComponentType $componentType
     *
     * @return ComponentTypeResource
     */
    public function update(UpdateComponentTypeRequest $request, ComponentType $componentType): ComponentTypeResource
    {
        $model = $componentType->update($request->validated());

        return new ComponentTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ComponentType $componentType
     *
     * @return Response
     */
    public function destroy(ComponentType $componentType): Response
    {
        $componentType->delete();

        return response()->noContent();
    }
}
