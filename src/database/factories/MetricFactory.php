<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Metric;
use App\Models\MetricDefinition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Metric>
 */
class MetricFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Metric>
     */
    protected $model = Metric::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'value' => $this->faker->randomFloat(2, 0, 100),
            'unit' => $this->faker->randomElement(['percent', 'ms', 'bytes', 'count', null]),
            'metric_definition_id' => MetricDefinition::factory(),
        ];
    }
}
