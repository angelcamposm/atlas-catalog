<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreEntityRequest;
use App\Http\Requests\UpdateEntityRequest;
use App\Http\Resources\EntityResource;
use App\Http\Resources\EntityResourceCollection;
use App\Models\Entity;
use Illuminate\Http\Response;

class EntityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return EntityResourceCollection
     */
    public function index(): EntityResourceCollection
    {
        return new EntityResourceCollection(Entity::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreEntityRequest $request
     *
     * @return EntityResource
     */
    public function store(StoreEntityRequest $request): EntityResource
    {
        $model = Entity::create($request->validated());

        return new EntityResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Entity $entity
     *
     * @return EntityResource
     */
    public function show(Entity $entity): EntityResource
    {
        return new EntityResource($entity);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateEntityRequest $request
     * @param Entity $entity
     *
     * @return EntityResource
     */
    public function update(UpdateEntityRequest $request, Entity $entity): EntityResource
    {
        $model = $entity->update($request->validated());

        return new EntityResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Entity $entity
     *
     * @return Response
     */
    public function destroy(Entity $entity): Response
    {
        $entity->delete();

        return response()->noContent();
    }
}
