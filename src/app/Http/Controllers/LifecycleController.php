<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreLifecycleRequest;
use App\Http\Requests\UpdateLifecycleRequest;
use App\Http\Resources\LifecycleResource;
use App\Http\Resources\LifecycleResourceCollection;
use App\Models\Lifecycle;
use Illuminate\Http\Response;

class LifecycleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return LifecycleResourceCollection
     */
    public function index(): LifecycleResourceCollection
    {
        return new LifecycleResourceCollection(Lifecycle::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreLifecycleRequest $request
     *
     * @return LifecycleResource
     */
    public function store(StoreLifecycleRequest $request): LifecycleResource
    {
        $model = Lifecycle::create($request->validated());

        return new LifecycleResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Lifecycle $lifecycle
     *
     * @return LifecycleResource
     */
    public function show(Lifecycle $lifecycle): LifecycleResource
    {
        return new LifecycleResource($lifecycle);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateLifecycleRequest $request
     * @param Lifecycle $lifecycle
     *
     * @return LifecycleResource
     */
    public function update(UpdateLifecycleRequest $request, Lifecycle $lifecycle): LifecycleResource
    {
        $model = $lifecycle->update($request->validated());

        return new LifecycleResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Lifecycle $lifecycle
     *
     * @return Response
     */
    public function destroy(Lifecycle $lifecycle): Response
    {
        $lifecycle->delete();

        return response()->noContent();
    }
}
