<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vendor>
 */
class VendorFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Vendor>
     */
    protected $model = Vendor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company(),
            'icon' => self::icon(),
            'url' => $this->faker->url(),
        ];
    }

    public static function icon(): string
    {
        return fake()->word().'.svg';
    }
}
