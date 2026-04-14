<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkflowRunResource extends JsonResource
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
            'workflow_job_id' => $this->workflow_job_id,
            'description' => $this->description,
            'display_name' => $this->display_name,
            'duration_milliseconds' => $this->duration_milliseconds,
            'is_enabled' => $this->is_enabled,
            'result' => $this->result,
            'url' => $this->url,
            'started_at' => $this->started_at,
            'started_by' => $this->started_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
