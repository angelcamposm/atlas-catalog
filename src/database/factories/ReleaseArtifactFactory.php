<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Release;
use App\Models\ReleaseArtifact;
use App\Traits\BelongsToUserState;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReleaseArtifact>
 */
class ReleaseArtifactFactory extends Factory
{
    use BelongsToUserState;

    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ReleaseArtifact>
     */
    protected $model = ReleaseArtifact::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'release_id' => Release::factory(),
            'type' => $this->faker->randomElement(['docker', 'jar', 'zip', 'sbom']),
            'name' => $this->faker->word() . '.' . $this->faker->fileExtension(),
            'url' => $this->faker->url(),
            'digest_md5' => $this->faker->md5(),
            'digest_sha1' => $this->faker->sha1(),
            'digest_sha256' => $this->faker->sha256(),
            'size_bytes' => $this->faker->numberBetween(1000, 10000000),
        ];
    }
}
