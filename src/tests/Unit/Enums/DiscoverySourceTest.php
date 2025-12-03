<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\DiscoverySource;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(DiscoverySource::class)]
class DiscoverySourceTest extends TestCase
{
    #[Test]
    #[DataProvider('sourceNameProvider')]
    public function it_returns_the_correct_display_name(DiscoverySource $source, string $expectedName): void
    {
        $this->assertSame($expectedName, $source->displayName());
    }

    #[Test]
    #[DataProvider('sourceIconProvider')]
    public function it_returns_the_correct_icon(DiscoverySource $source, string $expectedIcon): void
    {
        $this->assertSame($expectedIcon, $source->icon());
    }

    public static function sourceIconProvider(): array
    {
        return [
            'Manual' => [DiscoverySource::Manual, 'hand'],
            'Pipeline' => [DiscoverySource::Pipeline, 'cogs'],
            'Scan' => [DiscoverySource::Scan, 'search'],
        ];
    }

    public static function sourceNameProvider(): array
    {
        return [
            'Manual' => [DiscoverySource::Manual, 'Manual'],
            'Pipeline' => [DiscoverySource::Pipeline, 'Pipeline'],
            'Scan' => [DiscoverySource::Scan, 'Scan'],
        ];
    }
}
