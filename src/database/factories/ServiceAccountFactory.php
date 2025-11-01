<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ServiceAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceAccount>
 */
class ServiceAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'namespace' => $this->faker->slug,
        ];
    }
}
