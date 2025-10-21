<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Api;
use App\Models\ApiAccessPolicy;
use App\Models\ApiStatus;
use App\Models\ApiType;
use App\Models\AuthenticationMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Api>
 */
class ApiFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<TModel>
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
            'name' => $this->faker->name,
            'description' => $this->faker->sentence,
            'access_policy_id' => ApiAccessPolicy::inRandomOrder()->first()->id,
            'authentication_method_id' => AuthenticationMethod::inRandomOrder()->first()->id,
            'protocol' => 'http',
            'document_specification' => $this->faker->text,
            'status_id' => ApiStatus::inRandomOrder()->first()->id,
            'type_id' => ApiType::inRandomOrder()->first()->id,
            'url' => $this->faker->url(),
            'version' => $this->faker->semver((bool) rand(0, 1), (bool) rand(0, 1)),
        ];
    }
}
