<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ServiceAccount;
use App\Models\ServiceAccountToken;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceAccountToken>
 */
class ServiceAccountTokenFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ServiceAccountToken>
     */
    protected $model = ServiceAccountToken::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'token' => bcrypt($this->faker->text(250)),
            'expires_at' => now()->addDays($this->faker->randomElement(range(1, 30))),
        ];
    }

    /**
     * Configures the state of the factory to include a service account ID
     * by creating and associating a new service account.
     *
     * @return Factory Returns the updated factory instance with the modified state.
     */
    public function withServiceAccount(): Factory
    {
        return $this->state(function (array $attributes): array {
            return [
                'service_account_id' => ServiceAccount::factory()->create()->id,
            ];
        });
    }
}
