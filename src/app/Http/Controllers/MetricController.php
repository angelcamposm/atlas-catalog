<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreMetricRequest;
use App\Http\Requests\UpdateMetricRequest;
use App\Http\Resources\MetricResource;
use App\Http\Resources\MetricResourceCollection;
use App\Models\Metric;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class MetricController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return MetricResourceCollection
     */
    public function index(Request $request): MetricResourceCollection
    {
        return new MetricResourceCollection(
            Metric::filter($request)->search($request)->sort($request)->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreMetricRequest $request
     *
     * @return MetricResource
     */
    public function store(StoreMetricRequest $request): MetricResource
    {
        $metric = Metric::create($request->validated());

        return new MetricResource($metric);
    }

    /**
     * Display the specified resource.
     *
     * @param Metric $metric
     *
     * @return MetricResource
     */
    public function show(Metric $metric): MetricResource
    {
        return new MetricResource($metric);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateMetricRequest $request
     * @param Metric $metric
     *
     * @return MetricResource
     */
    public function update(UpdateMetricRequest $request, Metric $metric): MetricResource
    {
        $metric->update($request->validated());

        return new MetricResource($metric);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Metric $metric
     *
     * @return Response
     */
    public function destroy(Metric $metric): Response
    {
        Gate::authorize('delete', $metric);

        $metric->delete();

        return response()->noContent();
    }
}
