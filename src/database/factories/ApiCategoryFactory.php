<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ApiCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends Factory<ApiCategory>
 */
class ApiCategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Model>
     */
    protected $model = ApiCategory::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word,
            'description' => $this->faker->sentence,
        ];
    }
}
