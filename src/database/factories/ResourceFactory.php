<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Resource;
use App\Models\ResourceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Resource>
 */
class ResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->domainWord,
            'type_id' => ResourceType::pluck('id')->random(1),
        ];
    }
}
