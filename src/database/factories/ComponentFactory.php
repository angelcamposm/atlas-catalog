<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\DiscoverySource;
use App\Models\Component;
use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Component>
 */
class ComponentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Component>
     */
    protected $model = Component::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->slug(3);

        return [
            'name' => Str::slug($name),
            'description' => $this->faker->sentence(),
            'discovery_source' => $this->faker->randomElement(DiscoverySource::cases()),
            'display_name' => $name,
//            'domain_id' => BusinessDomain::factory(),
            'is_stateless' => $this->faker->boolean(),
            'owner_id' => Group::factory(),
//            'platform_id' => Platform::factory(),
            'slug' => Str::slug($name),
            'tags' => json_encode($this->faker->words(3)),
//            'tier_id' => BusinessTier::factory(),
        ];
    }

    /**
     * Indicate that the component is stateless.
     *
     * @return self
     */
    public function stateless(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_stateless' => true,
        ]);
    }

    /**
     * Indicate that the component is stateful.
     *
     * @return self
     */
    public function stateful(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_stateless' => false,
        ]);
    }
}
