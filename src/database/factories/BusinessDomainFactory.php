<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\BusinessDomainCategory;
use App\Models\BusinessDomain;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BusinessDomain>
 */
class BusinessDomainFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<BusinessDomain>
     */
    protected $model = BusinessDomain::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'display_name' => $this->faker->words(3, true),
            'description' => Str::substr($this->faker->sentence(), 0, 250),
            'category' => $this->faker->randomElement(BusinessDomainCategory::cases()),
            'is_active' => $this->faker->boolean(),
            'parent_id' => null,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the business domain is active.
     *
     * @return self
     */
    public function active(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the business domain is inactive.
     *
     * @return self
     */
    public function inactive(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
