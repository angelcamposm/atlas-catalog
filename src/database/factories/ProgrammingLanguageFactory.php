<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ProgrammingLanguage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProgrammingLanguage>
 */
class ProgrammingLanguageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ProgrammingLanguage>
     */
    protected $model = ProgrammingLanguage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'icon' => $this->faker->word(),
            'is_enabled' => $this->faker->boolean(),
            'url' => $this->faker->url(),
        ];
    }
}
