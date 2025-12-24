<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Environment;
use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Environment>
 */
class EnvironmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Environment>
     */
    protected $model = Environment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->name;

        return [
            'name' => Str::slug($name),
            'abbr' => $this->faker->countryISOAlpha3(),
            'approval_required' => $this->faker->boolean(),
            'description' => $this->faker->text(250),
            'display_in_matrix' => $this->faker->boolean(),
            'display_name' => $name,
            'is_production_environment' => $this->faker->boolean(10),
            'owner_id' => Group::factory(),
            'prefix' => null,
            'sort_order' => 0,
            'suffix' => null,
        ];
    }
}
