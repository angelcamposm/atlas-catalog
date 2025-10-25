<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreEnvironmentRequest;
use App\Http\Requests\UpdateEnvironmentRequest;
use App\Http\Resources\EnvironmentResource;
use App\Http\Resources\EnvironmentResourceCollection;
use App\Models\Environment;
use Illuminate\Http\Response;

class EnvironmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return EnvironmentResourceCollection
     */
    public function index(): EnvironmentResourceCollection
    {
        return new EnvironmentResourceCollection(Environment::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreEnvironmentRequest $request
     *
     * @return EnvironmentResource
     */
    public function store(StoreEnvironmentRequest $request): EnvironmentResource
    {
        $model = Environment::create($request->validated());

        return new EnvironmentResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Environment $environment
     *
     * @return EnvironmentResource
     */
    public function show(Environment $environment): EnvironmentResource
    {
        return new EnvironmentResource($environment);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateEnvironmentRequest $request
     * @param Environment $environment
     *
     * @return EnvironmentResource
     */
    public function update(UpdateEnvironmentRequest $request, Environment $environment): EnvironmentResource
    {
        $model = $environment->update($request->validated());

        return new EnvironmentResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Environment $environment
     *
     * @return Response
     */
    public function destroy(Environment $environment): Response
    {
        $environment->delete();

        return response()->noContent();
    }
}
