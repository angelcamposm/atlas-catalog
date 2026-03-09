<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\CredentialType;
use App\Models\Credential;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Credential>
 */
class CredentialFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Credential>
     */
    protected $model = Credential::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(3, true),
            'type' => CredentialType::ApiToken,
            'identity' => $this->faker->userName(),
            'secret' => ['token' => $this->faker->sha256()],
            'meta' => ['issuer' => $this->faker->company()],
            'expires_at' => $this->faker->dateTimeBetween('+1 month', '+1 year'),
            'rotated_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'description' => $this->faker->sentence(),
            'is_enabled' => true,
        ];
    }

    /**
     * Indicate that the credential is an SSH key.
     */
    public function sshKey(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => CredentialType::SshKey,
            'identity' => 'ubuntu',
            'secret' => [
                'private_key' => '-----BEGIN OPENSSH PRIVATE KEY-----...',
                'public_key' => 'ssh-rsa AAAAB3Nza...',
            ],
        ]);
    }

    /**
     * Indicate that the credential is Basic Auth.
     */
    public function basicAuth(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => CredentialType::BasicAuth,
            'identity' => $this->faker->userName(),
            'secret' => ['password' => $this->faker->password()],
        ]);
    }
}
