<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\GroupMemberRole;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GroupMemberRole>
 */
class GroupMemberRoleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<GroupMemberRole>
     */
    protected $model = GroupMemberRole::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->name(),
            'description' => $this->faker->text(250),
        ];
    }
}
