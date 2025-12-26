<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ServiceModel;
use App\Models\User;
use App\Traits\BelongsToUserState;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ServiceModel>
 */
class ServiceModelFactory extends Factory
{
    use BelongsToUserState;

    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ServiceModel>
     */
    protected $model = ServiceModel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);
        $abbrv = strtoupper(Str::slug($name));

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'abbrv' => $abbrv,
            'display_name' => $name,
            'description' => Str::limit($this->faker->sentence(), 255),
        ];
    }
}
