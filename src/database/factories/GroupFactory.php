<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Group;
use App\Models\GroupType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Group>
 */
class GroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'description' => $this->faker->sentence,
            'email' => $this->faker->companyEmail,
            'icon' => null,
            'label' => null,
            'parent_id' => Group::inRandomOrder()->first()?->id,
            'type_id' => GroupType::inRandomOrder()->first()?->id,
        ];
    }
}
