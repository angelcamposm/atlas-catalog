<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeploymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'component' => new ComponentResource($this->whenLoaded('component')),
            'environment' => new EnvironmentResource($this->whenLoaded('environment')),
            'cluster' => new ClusterResource($this->whenLoaded('cluster')),
            'release' => new ReleaseResource($this->whenLoaded('release')),
            'version' => $this->version,
            'commit_hash' => $this->commit_hash,
            'docker_image_digest' => $this->docker_image_digest,
            'workflow_run' => new WorkflowRunResource($this->whenLoaded('workflowRun')),
            'triggered_by' => new UserResource($this->whenLoaded('triggerer')),
            'status' => $this->status,
            'started_at' => $this->started_at,
            'ended_at' => $this->ended_at,
            'duration_milliseconds' => $this->duration_milliseconds,
            'meta' => $this->meta,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
        ];
    }
}
