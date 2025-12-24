<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Link;
use App\Models\LinkCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<LinkCategory>
 */
class LinkCategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<LinkCategory>
     */
    protected $model = LinkCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'description' => Str::limit($this->faker->sentence(), 255),
            'icon' => $this->faker->word(),
            'model' => strtolower(class_basename(Link::class)),
            'parent_id' => null,
        ];
    }
}
