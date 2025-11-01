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

        $cpu = self::getCpuDetails();

        return [
            'name' => $host->name,
            'discovery_source' => self::getDiscoverySource(),
            'cpu_architecture' => $cpu->architecture,
            'cpu_sockets' => $cpu->sockets,
            'cpu_cores' => $cpu->cores,
            'cpu_threads' => $cpu->threads,
            'smt_enabled' => $cpu->smt_enabled,
            'memory_bytes' => self::getMemoryBytes(),
            'hostname' => $host->hostname,
            'fqdn' => $host->fqdn,
            'ip_address' => $this->faker->localIpv4(),
            'mac_address' => $this->faker->macAddress(),
            'node_type' => ['H', 'P', 'U', 'V'][rand(0, 3)],
            'os' => $this->faker->linuxPlatformToken(),
            'os_version' => $this->faker->semver(),
            'timezone' => $this->faker->timezone,
        ];
    }

    private static function getMemoryBytes(): int
    {
        return [
            MemoryBytes::gigabytes(8),
            MemoryBytes::gigabytes(16),
            MemoryBytes::gigabytes(24),
            MemoryBytes::gigabytes(32),
            MemoryBytes::gigabytes(48),
            MemoryBytes::gigabytes(64),
        ][rand(0, 5)];
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

    private static function getCpuCores(): int
    {
        return [2,4,8,16][rand(0, 3)];
    }

    private function getCpuDetails(): object
    {
        $cores = self::getCpuCores();
        $smt_enabled = (bool) rand(0, 1);

        if ($smt_enabled) {
            return (object) [
                'architecture' => CpuArchitecture::X86_64->value,
                'cores' => $cores,
                'smt_enabled' => true,
                'sockets' => [1,2][rand(0, 1)],
                'threads' => $cores,
            ];
        }

        return (object) [
            'architecture' => self::getCpuArchitecture(),
            'cores' => $cores,
            'smt_enabled' => false,
            'sockets' => 1,
            'threads' => 0,
        ];
    }

    public static function getCpuArchitecture(): string
    {
        return CpuArchitecture::cases()[rand(0, 2)]->value;
    }

    private static function getDiscoverySource(): string
    {
        return DiscoverySource::cases()[rand(0, 2)]->value;
    }
}
