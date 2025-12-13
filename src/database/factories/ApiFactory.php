<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Protocol;
use App\Models\Api;
use App\Models\ApiAccessPolicy;
use App\Models\ApiCategory;
use App\Models\ApiStatus;
use App\Models\ApiType;
use App\Models\AuthenticationMethod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Api>
 */
class ApiFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Api>
     */
    protected $model = Api::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'access_policy_id' => ApiAccessPolicy::factory(),
            'authentication_method_id' => AuthenticationMethod::factory(),
            'category_id' => ApiCategory::factory(),
            'deprecated_at' => $this->faker->date(),
            'deprecated_by' => User::factory(),
            'deprecation_reason' => $this->faker->sentence(),
            'description' => Str::limit($this->faker->sentence(), 255),
            'display_name' => $this->faker->name(),
            'document_specification' => $this->faker->text(),
            'protocol' => $this->faker->randomElement(Protocol::cases()),
            'released_at' => $this->faker->date(),
            'status_id' => ApiStatus::factory(),
            'type_id' => ApiType::factory(),
            'url' => $this->faker->url(),
            'version' => $this->faker->semver(),
        ];
    }
}
