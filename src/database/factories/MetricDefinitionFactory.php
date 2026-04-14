<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\MetricDefinition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MetricDefinition>
 */
class MetricDefinitionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<MetricDefinition>
     */
    protected $model = MetricDefinition::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->sentence(),
            'unit' => $this->faker->randomElement(['percent', 'ms', 'bytes', 'requests/s', 'count']),
        ];
    }
}
