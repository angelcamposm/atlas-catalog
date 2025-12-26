<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReleaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'version' => $this->version,
            'status' => $this->status,
            'changelog' => $this->changelog,
            'released_at' => $this->released_at,
            'component' => new ComponentResource($this->whenLoaded('component')),
            'artifacts' => ReleaseArtifactResource::collection($this->whenLoaded('artifacts')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
