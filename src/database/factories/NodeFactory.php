<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\CpuArchitecture;
use App\Enums\DiscoverySource;
use App\Helpers\MemoryBytes;
use App\Models\Node;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Node>
 */
class NodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $host = $this->getHostDetails();

        $cpu = $this->getCpuDetails();

        return [
            'name' => $host->name,
            'discovery_source' => $this->getDiscoverySource(),
            'cpu_architecture' => $cpu->architecture,
            'cpu_sockets' => $cpu->sockets,
            'cpu_cores' => $cpu->cores,
            'cpu_threads' => $cpu->threads,
            'smt_enabled' => $cpu->smt_enabled,
            'memory_bytes' => $this->getMemoryBytes(),
            'hostname' => $host->hostname,
            'fqdn' => $host->fqdn,
            'ip_address' => $this->faker->localIpv4(),
            'mac_address' => $this->faker->macAddress(),
            'node_type' => $this->faker->randomElements(['H', 'P', 'U', 'V']),
            'os' => $this->faker->linuxPlatformToken(),
            'os_version' => $this->faker->semver(),
            'timezone' => $this->faker->timezone,
        ];
    }

    private function getMemoryBytes(): int
    {
        return $this->faker->randomElement([
            MemoryBytes::gigabytes(8),
            MemoryBytes::gigabytes(16),
            MemoryBytes::gigabytes(24),
            MemoryBytes::gigabytes(32),
            MemoryBytes::gigabytes(48),
            MemoryBytes::gigabytes(64),
        ])->value;
    }

    private function getHostDetails(): object
    {
        $name = strtolower($this->faker->domainWord);
        $domain = $this->faker->domainWord;
        $tld = $this->faker->tld();
        $fqdn = "$name.$domain.$tld";

        return (object) [
            'name' => $name,
            'hostname' => $name,
            'fqdn' => $fqdn,
        ];
    }

    private function getCpuCores(): int
    {
        return $this->faker->randomElement([2, 4, 8, 16]);
    }

    private function getCpuDetails(): object
    {
        $cores = $this->getCpuCores();
        $smt_enabled = $this->faker->boolean();

        if ($smt_enabled) {
            return (object) [
                'architecture' => CpuArchitecture::X86_64->value,
                'cores' => $cores,
                'smt_enabled' => true,
                'sockets' => $this->faker->boolean(),
                'threads' => $cores,
            ];
        }

        return (object) [
            'architecture' => $this->getCpuArchitecture(),
            'cores' => $cores,
            'smt_enabled' => false,
            'sockets' => 1,
            'threads' => 0,
        ];
    }

    public function getCpuArchitecture(): string
    {
        return $this->faker->randomElement(CpuArchitecture::cases())->value;
    }

    private function getDiscoverySource(): string
    {
        return $this->faker->randomElement(DiscoverySource::cases())->value;
    }
}
