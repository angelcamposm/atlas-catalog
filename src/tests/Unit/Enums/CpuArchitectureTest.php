<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\CpuArchitecture;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(CpuArchitecture::class)]
class CpuArchitectureTest extends TestCase
{
    #[Test]
    #[DataProvider('architectureNameProvider')]
    public function it_returns_the_correct_display_name(CpuArchitecture $arch, string $expectedName): void
    {
        $this->assertSame($expectedName, $arch->displayName());
    }

    #[Test]
    #[DataProvider('architectureBitsProvider')]
    public function it_returns_the_correct_bitness(CpuArchitecture $arch, int $expectedBits): void
    {
        $this->assertSame($expectedBits, $arch->bits());
    }

    public static function architectureBitsProvider(): array
    {
        return [
            'ARM' => [CpuArchitecture::ARM, 32],
            'ARM64' => [CpuArchitecture::ARM64, 64],
            'x86-64' => [CpuArchitecture::X86_64, 64],
        ];
    }

    public static function architectureNameProvider(): array
    {
        return [
            'ARM' => [CpuArchitecture::ARM, 'ARM'],
            'ARM64' => [CpuArchitecture::ARM64, 'ARM64'],
            'x86-64' => [CpuArchitecture::X86_64, 'x86-64'],
        ];
    }
}
