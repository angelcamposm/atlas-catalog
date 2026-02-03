<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeploymentRequest;
use App\Http\Requests\UpdateDeploymentRequest;
use App\Http\Resources\DeploymentResource;
use App\Http\Resources\DeploymentResourceCollection;
use App\Models\Deployment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class DeploymentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): DeploymentResourceCollection
    {
        $deployments = Deployment::with(['component', 'environment', 'triggerer'])->paginate();

        return new DeploymentResourceCollection($deployments);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreDeploymentRequest  $request
     *
     * @return DeploymentResource
     */
    public function store(StoreDeploymentRequest $request): DeploymentResource
    {
        $data = $request->validated();

        if (!isset($data['started_at'])) {
            $data['started_at'] = Carbon::now();
        }

        $deployment = Deployment::create($data);

        return new DeploymentResource($deployment);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateDeploymentRequest  $request
     * @param  Deployment               $deployment
     *
     * @return DeploymentResource
     */
    public function update(UpdateDeploymentRequest $request, Deployment $deployment): DeploymentResource
    {
        $data = $request->validated();

        $endedAt = isset($data['ended_at'])
            ? Carbon::parse($data['ended_at'])
            : Carbon::now();

        $data['ended_at'] = $endedAt;

        // Calculate duration
        if ($deployment->started_at) {
            $data['duration_milliseconds'] = $deployment->started_at->diffInMilliseconds($endedAt);
        }

        // Merge meta if exists
        if (isset($data['meta']) && $deployment->meta) {
            $data['meta'] = array_merge($deployment->meta, $data['meta']);
        }

        $deployment->update($data);

        return new DeploymentResource($deployment);
    }

    /**
     * Display the specified resource.
     *
     * @param Deployment $deployment
     *
     * @return DeploymentResource
     */
    public function show(Deployment $deployment): DeploymentResource
    {
        $deployment->load([
            'component',
            'environment',
            'cluster',
            'release',
            'workflowRun',
            'triggerer'
        ]);

        return new DeploymentResource($deployment);
    }
}
