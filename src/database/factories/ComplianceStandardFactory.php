<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ComplianceStandard;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ComplianceStandard>
 */
class ComplianceStandardFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ComplianceStandard>
     */
    protected $model = ComplianceStandard::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'country_code' => $this->faker->countryCode(),
            'description' => Str::limit($this->faker->sentence(), 255),
            'display_name' => $this->faker->words(3, true),
            'focus_area' => $this->faker->word(),
            'industry' => $this->faker->word(),
            'url' => $this->faker->url(),
        ];
    }
}
