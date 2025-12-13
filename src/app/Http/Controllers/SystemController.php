<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreSystemRequest;
use App\Http\Requests\UpdateSystemRequest;
use App\Http\Resources\SystemResource;
use App\Http\Resources\SystemResourceCollection;
use App\Models\System;
use Illuminate\Http\Response;

class SystemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return SystemResourceCollection
     */
    public function index(): SystemResourceCollection
    {
        return new SystemResourceCollection(System::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreSystemRequest $request
     *
     * @return SystemResource
     */
    public function store(StoreSystemRequest $request): SystemResource
    {
        $model = System::create($request->validated());

        return new SystemResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param System $system
     *
     * @return SystemResource
     */
    public function show(System $system): SystemResource
    {
        return new SystemResource($system);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateSystemRequest $request
     * @param System $system
     *
     * @return SystemResource
     */
    public function update(UpdateSystemRequest $request, System $system): SystemResource
    {
        $model = $system->update($request->validated());

        return new SystemResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param System $system
     *
     * @return Response
     */
    public function destroy(System $system): Response
    {
        $system->delete();

        return response()->noContent();
    }
}
