<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Framework;
use App\Models\ProgrammingLanguage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Framework>
 */
class FrameworkFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Framework>
     */
    protected $model = Framework::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'description' => Str::limit($this->faker->sentence(), 255),
            'icon' => $this->faker->word(),
            'is_enabled' => $this->faker->boolean(),
            'language_id' => ProgrammingLanguage::factory(),
            'url' => $this->faker->url(),
        ];
    }
}
