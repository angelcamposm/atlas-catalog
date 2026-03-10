<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\ApiAccessPolicy;
use App\Models\Api;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class ApiAccessPolicyResource
 *
 * Transforms the ApiAccessPolicy enum into a JSON-serializable array.
 */
class ApiAccessPolicyResource extends JsonResource
{
    /**
     * @var array<int, string>
     */
    protected array $fields;

    /**
     * @var array<int, string>
     */
    protected array $includeRelationship;

    /**
     * ApiAccessPolicyResource constructor.
     *
     * @param mixed $resource
     * @param array<int, string> $includeRelationship
     * @param array<int, string> $fields
     */
    public function __construct(mixed $resource, array $includeRelationship = [], array $fields = [])
    {
        parent::__construct($resource);
        $this->includeRelationship = $includeRelationship;
        $this->fields = $fields;
    }

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /**
         * @var ApiAccessPolicy $enum
         */
        $enum = $this->resource;

        return [
            'id' => $enum->value,
            'name' => $enum->name,
            'display_name' => $enum->displayName(),
            'apis' => $this->when(
                $this->shouldIncludeApis(),
                function () use ($enum) {
                    $query = Api::query()->where('access_policy', $enum->value);

                    if (!empty($this->fields)) {
                        $query->select($this->fields);
                    }

                    return ApiResource::collection($query->get());
                }),
        ];
    }

    /**
     * Determines if the 'apis' relationship should be included.
     *
     * @return bool
     */
    private function shouldIncludeApis(): bool
    {
        return in_array('api', $this->includeRelationship, true);
    }
}
