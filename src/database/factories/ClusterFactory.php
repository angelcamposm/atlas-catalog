<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\K8sLicensingModel;
use App\Models\ClusterType;
use App\Models\Lifecycle;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClusterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $version = $this->faker->semver(true, true);

        $lifecycle = Lifecycle::pluck('id');
        $type = ClusterType::pluck('id');

        return [
            'name' => $this->getClusterName(),
            'api_url' => $this->getApiUrl(),
            'cluster_uuid' => $this->faker->uuid,
            'display_name' => fn (array $attributes) => ucwords(str_replace('-', ' ', $attributes['name'])),
            'full_version' => 'v'.$version.'-'.$this->faker->word.'+'.$this->faker->md5(),
            'has_licensing' => $this->faker->boolean,
            'licensing_model' => $this->faker->randomElement(K8sLicensingModel::cases()),
            'lifecycle_id' => $this->faker->randomElement($lifecycle),
            'tags' => $this->getTags(),
            'timezone' => $this->faker->timezone,
            'type_id' => $this->faker->randomElement($type),
            'version' => $version,
            'url' => $this->faker->url,
        ];
    }

    public function getApiUrl(): string
    {
        $url = $this->faker->url;

        if (str_ends_with($url, '/')) {
            $url = substr($url, 0, -1);
        }

        return "$url:6443";
    }

    public function getClusterName(): string
    {
        return 'k8s-'.strtolower($this->faker->domainWord).'-'.$this->faker->numberBetween(1, 100);
    }

    public function getTags(): string
    {
        $env = $this->faker->randomElement(['dev', 'staging', 'prod']);
        $region = $this->faker->randomElement(['us-east-1', 'eu-west-2']);

        return json_encode(['env' => $env, 'region' => $region]);
    }
}
