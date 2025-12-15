<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\BusinessDomainCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property BusinessDomainCategory $category
 * @property string $description
 * @property string $display_name
 * @property boolean $is_active
 * @property string $name
 * @property int $parent_id
 * @property Carbon $created_at
 * @property int $created_by
 * @property Carbon $updated_at
 * @property int $updated_by
 */
class BusinessDomainResource extends JsonResource
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
            'name' => $this->name,
            'display_name' => $this->display_name,
            'description' => $this->description,
            'category' => [
                'name' => $this->category->name,
                'value' => $this->category->value,
            ],
            'is_active' => $this->is_active,
            'parent_id' => $this->parent_id,
            'created_at' => $this->created_at,
            'created_by' => $this->created_by,
            'updated_at' => $this->updated_at,
            'updated_by' => $this->updated_by,
        ];
    }
}
