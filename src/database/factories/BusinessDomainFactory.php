<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\BusinessDomainCategory;
use App\Models\BusinessDomain;
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
        $name = $this->faker->unique()->name();

        return [
            'name' => Str::lower($name),
            'display_name' => $name,
            'description' => Str::substr($this->faker->sentence(), 0, 250),
            'category' => $this->faker->randomElement(BusinessDomainCategory::cases()),
            'is_enabled' => $this->faker->boolean(),
            'parent_id' => null,
            'slug' => Str::slug($name),
        ];
    }

    /**
     * Indicate that the business domain is enabled.
     *
     * @return self
     */
    public function enabled(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_enabled' => true,
        ]);
    }

    /**
     * Indicate that the business domain is disabled.
     *
     * @return self
     */
    public function disabled(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_enabled' => false,
        ]);
    }

    public function core(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'category' => BusinessDomainCategory::Core->value,
        ]);
    }

    public function generic(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'category' => BusinessDomainCategory::Generic->value,
        ]);
    }

    public function supporting(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'category' => BusinessDomainCategory::Supporting->value,
        ]);
    }
}
