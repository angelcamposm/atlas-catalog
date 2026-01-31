<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\JenkinsInstance;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JenkinsInstance>
 */
class JenkinsInstanceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<JenkinsInstance>
     */
    protected $model = JenkinsInstance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'driver' => 'jenkins',
            'is_enabled' => $this->faker->boolean(),
            'last_synced_at' => $this->faker->dateTime(),
            'url' => $this->faker->url(),
        ];
    }
}
