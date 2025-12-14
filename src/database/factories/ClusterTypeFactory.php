<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ClusterType;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ClusterType>
 */
class ClusterTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ClusterType>
     */
    protected $model = ClusterType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'icon' => $this->faker->word() . '.svg',
            'is_enabled' => $this->faker->boolean(),
            'vendor_id' => Vendor::factory(),
        ];
    }

    /**
     * Indicate that the cluster type is enabled.
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
     * Indicate that the cluster type is disabled.
     *
     * @return self
     */
    public function disabled(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_enabled' => false,
        ]);
    }
}
