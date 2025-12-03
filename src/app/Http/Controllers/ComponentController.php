<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreComponentRequest;
use App\Http\Requests\UpdateComponentRequest;
use App\Http\Resources\ComponentResource;
use App\Http\Resources\ComponentResourceCollection;
use App\Models\Component;
use Illuminate\Http\Response;

class ComponentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ComponentResourceCollection
     */
    public function index(): ComponentResourceCollection
    {
        return new ComponentResourceCollection(Component::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreComponentRequest $request
     *
     * @return ComponentResource
     */
    public function store(StoreComponentRequest $request): ComponentResource
    {
        $model = Component::create($request->validated());

        return new ComponentResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Component $component
     *
     * @return ComponentResource
     */
    public function show(Component $component): ComponentResource
    {
        return new ComponentResource($component);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateComponentRequest $request
     * @param Component $component
     *
     * @return ComponentResource
     */
    public function update(UpdateComponentRequest $request, Component $component): ComponentResource
    {
        $model = $component->update($request->validated());

        return new ComponentResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Component $component
     *
     * @return Response
     */
    public function destroy(Component $component): Response
    {
        $component->delete();

        return response()->noContent();
    }
}
