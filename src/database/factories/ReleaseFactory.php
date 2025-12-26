<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Component;
use App\Models\Release;
use App\Models\WorkflowRun;
use App\Traits\BelongsToUserState;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Release>
 */
class ReleaseFactory extends Factory
{
    use BelongsToUserState;

    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Release>
     */
    protected $model = Release::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'component_id' => Component::factory(),
            'workflow_run_id' => WorkflowRun::factory(),
            'version' => $this->faker->semver(),
            'status' => $this->faker->randomElement(['draft', 'published', 'deprecated']),
            'changelog' => $this->faker->paragraph(),
            'metadata' => ['build_number' => $this->faker->randomNumber()],
            'released_at' => $this->faker->dateTime(),
        ];
    }
}
