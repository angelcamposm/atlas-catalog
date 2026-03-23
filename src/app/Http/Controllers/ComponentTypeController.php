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
     * @param ComponentType $component_type
     *
     * @return ComponentTypeResource
     */
    public function show(ComponentType $component_type): ComponentTypeResource
    {
        return new ComponentTypeResource($component_type);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateComponentTypeRequest $request
     * @param ComponentType $component_type
     *
     * @return ComponentTypeResource
     */
    public function update(UpdateComponentTypeRequest $request, ComponentType $component_type): ComponentTypeResource
    {
        $model = tap($component_type)->update($request->validated());

        return new ComponentTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ComponentType $component_type
     *
     * @return Response
     */
    public function destroy(ComponentType $component_type): Response
    {
        $component_type->delete();

        return response()->noContent();
    }
}
