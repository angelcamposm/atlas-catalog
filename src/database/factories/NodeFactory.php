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
        $name = strtolower(fake()->domainWord());
        $domain = fake()->domainWord();
        $tld = fake()->tld();
        $fqdn = "$name.$domain.$tld";

        $cores = fake()->randomElement([2, 4, 8, 16]);
        $smt_enabled = fake()->boolean();
        $threads = $smt_enabled ? $cores : 0;

        return [
            'name' => $name,
            'discovery_source' => fake()->randomElement(DiscoverySource::cases()),
            'cpu_architecture' => fake()->randomElement(CpuArchitecture::cases()),
            'cpu_sockets' => fake()->boolean(),
            'cpu_cores' => $cores,
            'cpu_threads' => $threads,
            'smt_enabled' => $smt_enabled,
            'memory_bytes' => fake()->randomElement([
                MemoryBytes::gigabytes(8),
                MemoryBytes::gigabytes(16),
                MemoryBytes::gigabytes(24),
                MemoryBytes::gigabytes(32),
                MemoryBytes::gigabytes(48),
                MemoryBytes::gigabytes(64),
            ]),
            'hostname' => $name,
            'fqdn' => $fqdn,
            'ip_address' => fake()->localIpv4(),
            'mac_address' => fake()->macAddress(),
            'node_type' => fake()->randomElement(NodeType::cases()),
            'os' => fake()->linuxPlatformToken(),
            'os_version' => fake()->semver(),
            'timezone' => fake()->timezone(),
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
