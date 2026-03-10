<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ComplianceRequirement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ComplianceRequirement>
 */
class ComplianceRequirementFactory extends Factory
{
    protected $model = ComplianceRequirement::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->sentence(3),
            'description' => $this->faker->optional()->paragraph(),
            'severity' => $this->faker->randomElement(['critical', 'high', 'medium', 'low']),
        ];
    }
}
