<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\WorkflowRunResult;
use App\Models\User;
use App\Models\WorkflowJob;
use App\Models\WorkflowRun;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkflowRun>
 */
class WorkflowRunFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<WorkflowRun>
     */
    protected $model = WorkflowRun::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'workflow_job_id' => WorkflowJob::factory(),
            'description' => $this->faker->sentence(),
            'display_name' => $this->faker->words(3, true),
            'duration_milliseconds' => $this->faker->numberBetween(1000, 60000),
            'is_enabled' => $this->faker->boolean(),
            'result' => $this->faker->randomElement(WorkflowRunResult::cases()),
            'url' => $this->faker->url(),
            'started_at' => $this->faker->dateTimeBetween('-1 hour', 'now'),
            'started_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the workflow run result was a failure.
     *
     * @return self
     */
    public function failure(): self
    {
        return $this->state(fn (array $attributes) => [
            'result' => WorkflowRunResult::Failure,
        ]);
    }

    /**
     * Indicate that the workflow run result was a success.
     *
     * @return self
     */
    public function success(): self
    {
        return $this->state(fn (array $attributes) => [
            'result' => WorkflowRunResult::Success,
        ]);
    }

    /**
     * Indicate that the workflow run result was aborted.
     *
     * @return self
     */
    public function aborted(): self
    {
        return $this->state(fn (array $attributes) => [
            'result' => WorkflowRunResult::Aborted,
        ]);
    }

    /**
     * Indicate that the workflow run result was not built.
     *
     * @return self
     */
    public function notBuilt(): self
    {
        return $this->state(fn (array $attributes) => [
            'result' => WorkflowRunResult::NotBuilt,
        ]);
    }

    /**
     * Indicate that the workflow run result was unstable.
     *
     * @return self
     */
    public function unstable(): self
    {
        return $this->state(fn (array $attributes) => [
            'result' => WorkflowRunResult::Unstable,
        ]);
    }
}
