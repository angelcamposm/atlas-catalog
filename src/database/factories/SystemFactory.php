<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\System;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<System>
 */
class SystemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<System>
     */
    protected $model = System::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'display_name' => $this->faker->text(50),
            'description' => $this->faker->text(250),
            'tags' => json_encode($this->faker->words(3)),
        ];
    }
}
