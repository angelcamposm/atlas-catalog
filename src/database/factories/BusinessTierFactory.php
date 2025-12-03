<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\BusinessTier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BusinessTier>
 */
class BusinessTierFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<BusinessTier>
     */
    protected $model = BusinessTier::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tierName = fake()->randomElement(['Bronze', 'Silver', 'Gold', 'Platinum', 'Enterprise', 'Foundation', 'Professional']);

        return [
            'name' => "{$tierName} Tier",
            'code' => $this->faker->unique()->regexify('[A-Z]{1}[0-9]{1}'),
            'description' => Str::substr($this->faker->sentence(), 0, 250),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}
