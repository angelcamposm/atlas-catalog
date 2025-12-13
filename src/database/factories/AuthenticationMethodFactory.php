<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\AuthenticationMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuthenticationMethod>
 */
class AuthenticationMethodFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<AuthenticationMethod>
     */
    protected $model = AuthenticationMethod::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word,
            'description' => $this->faker->sentence,
        ];
    }
}
