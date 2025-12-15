<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ServiceStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceStatus>
 */
class ServiceStatusFactory extends Factory
{

    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ServiceStatus>
     */
    protected $model = ServiceStatus::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'description' => $this->faker->text(250),
            'allow_deployments' => $this->faker->boolean(),
            'icon' => $this->faker->word().'.svg',
        ];
    }
}
