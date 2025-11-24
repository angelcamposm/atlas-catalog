<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Lifecycle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends Factory<Lifecycle>
 */
class LifecycleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Model>
     */
    protected $model = Lifecycle::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'approval_required' => $this->faker->boolean(),
            'color' => $this->faker->hexColor,
            'description' => $this->faker->sentence,
            'name' => $this->faker->unique()->word,
        ];
    }
}
