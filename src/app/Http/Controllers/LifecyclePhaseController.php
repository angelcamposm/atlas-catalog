<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreLifecyclePhaseRequest;
use App\Http\Requests\UpdateLifecyclePhaseRequest;
use App\Http\Resources\LifecyclePhaseResource;
use App\Http\Resources\LifecyclePhaseResourceCollection;
use App\Models\LifecyclePhase;
use Illuminate\Http\Response;

class LifecyclePhaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return LifecyclePhaseResourceCollection
     */
    public function index(): LifecyclePhaseResourceCollection
    {
        return new LifecyclePhaseResourceCollection(LifecyclePhase::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreLifecyclePhaseRequest  $request
     *
     * @return LifecyclePhaseResource
     */
    public function store(StoreLifecyclePhaseRequest $request): LifecyclePhaseResource
    {
        $model = LifecyclePhase::create($request->validated());

        return new LifecyclePhaseResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param LifecyclePhase  $lifecycle
     *
     * @return LifecyclePhaseResource
     */
    public function show(LifecyclePhase $lifecycle): LifecyclePhaseResource
    {
        return new LifecyclePhaseResource($lifecycle);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateLifecyclePhaseRequest  $request
     * @param LifecyclePhase               $lifecycle
     *
     * @return LifecyclePhaseResource
     */
    public function update(UpdateLifecyclePhaseRequest $request, LifecyclePhase $lifecycle): LifecyclePhaseResource
    {
        $model = $lifecycle->update($request->validated());

        return new LifecyclePhaseResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param LifecyclePhase  $lifecycle
     *
     * @return Response
     */
    public function destroy(LifecyclePhase $lifecycle): Response
    {
        $lifecycle->delete();

        return response()->noContent();
    }
}
