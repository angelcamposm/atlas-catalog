<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Entity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Entity>
 */
class EntityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Entity>
     */
    protected $model = Entity::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->name(),
            'description' => $this->faker->sentence(),
            'is_aggregate' => $this->faker->boolean(25),
            'is_aggregate_root' => $this->faker->boolean(10),
            'is_enabled' => $this->faker->boolean(90),
        ];
    }

    /**
     * Configures the factory state to mark the created entities as aggregates.
     *
     * @return Factory A factory instance with the modified state.
     */
    public function aggregate(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'is_aggregate' => true,
        ]);
    }

    /**
     * Configures the factory state to designate the created entities as aggregate roots.
     *
     * @return Factory A factory instance with the adjusted state.
     */
    public function rootAggregate(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'is_aggregate_root' => true,
        ]);
    }
}
