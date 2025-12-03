<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ServiceAccountToken;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceAccountToken>
 */
class ServiceAccountTokenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'token' => bcrypt($this->faker->text(250)),
            'expires_at' => now()->addDays($this->faker->randomElement(range(1, 30))),
        ];
    }
}
