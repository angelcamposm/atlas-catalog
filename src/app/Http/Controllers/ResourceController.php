<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Http\Resources\ResourceResource;
use App\Http\Resources\ResourceResourceCollection;
use App\Models\Resource;
use Illuminate\Http\Response;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ResourceResourceCollection
     */
    public function index(): ResourceResourceCollection
    {
        return new ResourceResourceCollection(Resource::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreResourceRequest $request
     *
     * @return ResourceResource
     */
    public function store(StoreResourceRequest $request): ResourceResource
    {
        $model = Resource::create($request->validated());

        return new ResourceResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Resource $resource
     *
     * @return ResourceResource
     */
    public function show(Resource $resource): ResourceResource
    {
        return new ResourceResource($resource);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateResourceRequest $request
     * @param Resource $resource
     *
     * @return ResourceResource
     */
    public function update(UpdateResourceRequest $request, Resource $resource): ResourceResource
    {
        $model = $resource->update($request->validated());

        return new ResourceResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Resource $resource
     *
     * @return Response
     */
    public function destroy(Resource $resource): Response
    {
        $resource->delete();

        return response()->noContent();
    }
}
