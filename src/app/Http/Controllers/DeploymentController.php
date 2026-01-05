<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeploymentRequest;
use App\Http\Requests\UpdateDeploymentRequest;
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
        $deployments = Deployment::paginate();

        return new DeploymentResourceCollection($deployments);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreDeploymentRequest  $request
     *
     * @return JsonResponse
     */
    public function store(StoreDeploymentRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (!isset($data['started_at'])) {
            $data['started_at'] = Carbon::now();
        }

        $deployment = Deployment::create($data);

        return response()->json($deployment, 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateDeploymentRequest  $request
     * @param  Deployment               $deployment
     *
     * @return JsonResponse
     */
    public function update(UpdateDeploymentRequest $request, Deployment $deployment): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['ended_at'])) {
            $endedAt = Carbon::parse($data['ended_at']);
        } else {
            $endedAt = Carbon::now();
        }

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

        return response()->json($deployment);
    }

    public function show(Deployment $deployment): JsonResponse
    {
        return response()->json($deployment);
    }
}
