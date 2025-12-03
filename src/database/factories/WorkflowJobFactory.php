<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\DiscoverySource;
use App\Models\Component;
use App\Models\User;
use App\Models\WorkflowJob;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkflowJob>
 */
class WorkflowJobFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<WorkflowJob>
     */
    protected $model = WorkflowJob::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);

        return [
            'name' => $name,
            'component_id' => Component::factory(),
            'display_name' => $name,
            'description' => $this->faker->sentence(),
            'discovery_source' => $this->faker->randomElement(DiscoverySource::cases()),
            'is_enabled' => $this->faker->boolean(),
            'url' => $this->faker->url(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the workflow job is enabled.
     *
     * @return self
     */
    public function enabled(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_enabled' => true,
        ]);
    }

    /**
     * Indicate that the workflow job is disabled.
     *
     * @return self
     */
    public function disabled(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_enabled' => false,
        ]);
    }
}
