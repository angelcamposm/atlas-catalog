<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\WorkflowRunCommit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkflowRunCommit>
 */
class WorkflowRunCommitFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<WorkflowRunCommit>
     */
    protected $model = WorkflowRunCommit::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'author_email' => $this->faker->email(),
            'author_name' => $this->faker->name(),
            'commit_date' => $this->faker->date(),
            'commit_message' => $this->faker->sentence(),
            'commit_sha' => $this->faker->sha256,
            'ref_name' => $this->faker->word(),
            'repo_url' => $this->faker->url(),
        ];
    }
}
