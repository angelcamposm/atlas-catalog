<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\CpuArchitecture;
use App\Enums\DiscoverySource;
use App\Enums\NodeType;
use App\Helpers\MemoryBytes;
use App\Models\Node;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Node>
 */
class NodeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Node>
     */
    protected $model = Node::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = strtolower($this->faker->domainWord());
        $domain = $this->faker->domainWord();
        $tld = $this->faker->tld();
        $fqdn = "$name.$domain.$tld";

        $cores = $this->faker->randomElement([2, 4, 8, 16]);
        $smt_enabled = $this->faker->boolean();
        $threads = $smt_enabled ? $cores : 0;

        return [
            'name' => $name,
            'discovery_source' => $this->faker->randomElement(DiscoverySource::cases()),
            'cpu_architecture' => $this->faker->randomElement(CpuArchitecture::cases()),
            'cpu_sockets' => $this->faker->boolean(),
            'cpu_cores' => $cores,
            'cpu_threads' => $threads,
            'smt_enabled' => $smt_enabled,
            'memory_bytes' => $this->faker->randomElement([
                MemoryBytes::gigabytes(8),
                MemoryBytes::gigabytes(16),
                MemoryBytes::gigabytes(24),
                MemoryBytes::gigabytes(32),
                MemoryBytes::gigabytes(48),
                MemoryBytes::gigabytes(64),
            ]),
            'hostname' => $name,
            'fqdn' => $fqdn,
            'ip_address' => $this->faker->localIpv4(),
            'mac_address' => $this->faker->macAddress(),
            'node_type' => $this->faker->randomElement(NodeType::cases()),
            'os' => $this->faker->linuxPlatformToken(),
            'os_version' => $this->faker->semver(),
            'timezone' => $this->faker->timezone(),
        ];
    }

    /**
     * Indicate that the node is a hybrid node.
     *
     * @return self
     */
    public function hybrid(): self
    {
        return $this->state(fn (array $attributes) => [
            'node_type' => NodeType::Hybrid,
        ]);
    }

    /**
     * Indicate that the node is a physical node.
     *
     * @return self
     */
    public function physical(): self
    {
        return $this->state(fn (array $attributes) => [
            'node_type' => NodeType::Physical,
        ]);
    }

    /**
     * Indicate that the node is an unknown node.
     *
     * @return self
     */
    public function unknown(): self
    {
        return $this->state(fn (array $attributes) => [
            'node_type' => NodeType::Unknown,
        ]);
    }

    /**
     * Indicate that the node is a virtual node.
     *
     * @return self
     */
    public function virtual(): self
    {
        return $this->state(fn (array $attributes) => [
            'node_type' => NodeType::Virtual,
        ]);
    }

    /**
     * Indicate that the node was discovered manually.
     *
     * @return self
     */
    public function manual(): self
    {
        return $this->state(fn (array $attributes) => [
            'discovery_source' => DiscoverySource::Manual,
        ]);
    }

    /**
     * Indicate that the node was discovered through a CI-CD pipeline.
     *
     * @return self
     */
    public function pipeline(): self
    {
        return $this->state(fn (array $attributes) => [
            'discovery_source' => DiscoverySource::Pipeline,
        ]);
    }

    /**
     * Indicate that the node was discovered by running a cluster scan.
     *
     * @return self
     */
    public function scan(): self
    {
        return $this->state(fn (array $attributes) => [
            'discovery_source' => DiscoverySource::Scan,
        ]);
    }
}
