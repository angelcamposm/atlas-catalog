<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreResourceTypeRequest;
use App\Http\Requests\UpdateResourceTypeRequest;
use App\Http\Resources\ResourceTypeResource;
use App\Http\Resources\ResourceTypeResourceCollection;
use App\Models\ResourceType;
use Illuminate\Http\Response;

class ResourceTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ResourceTypeResourceCollection
     */
    public function index(): ResourceTypeResourceCollection
    {
        return new ResourceTypeResourceCollection(ResourceType::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreResourceTypeRequest $request
     *
     * @return ResourceTypeResource
     */
    public function store(StoreResourceTypeRequest $request): ResourceTypeResource
    {
        $model = ResourceType::create($request->validated());

        return new ResourceTypeResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ResourceType $resourceType
     *
     * @return ResourceTypeResource
     */
    public function show(ResourceType $resourceType): ResourceTypeResource
    {
        return new ResourceTypeResource($resourceType);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateResourceTypeRequest $request
     * @param ResourceType $resourceType
     *
     * @return ResourceTypeResource
     */
    public function update(UpdateResourceTypeRequest $request, ResourceType $resourceType): ResourceTypeResource
    {
        $model = $resourceType->update($request->validated());

        return new ResourceTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ResourceType $resourceType
     *
     * @return Response
     */
    public function destroy(ResourceType $resourceType): Response
    {
        $resourceType->delete();

        return response()->noContent();
    }
}
