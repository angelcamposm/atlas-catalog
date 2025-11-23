<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\NodeType;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(NodeType::class)]
class NodeTypeTest extends TestCase
{
    #[Test]
    #[DataProvider('nodeTypeNameProvider')]
    public function it_returns_the_correct_display_name(NodeType $type, string $expectedName): void
    {
        $this->assertSame($expectedName, $type->displayName());
    }

    #[Test]
    #[DataProvider('nodeTypeColorProvider')]
    public function it_returns_the_correct_color(NodeType $type, string $expectedColor): void
    {
        $this->assertSame($expectedColor, $type->color());
    }

    public static function nodeTypeColorProvider(): array
    {
        return [
            'Hybrid' => [NodeType::Hybrid, 'purple'],
            'Physical' => [NodeType::Physical, 'blue'],
            'Unknown' => [NodeType::Unknown, 'gray'],
            'Virtual' => [NodeType::Virtual, 'green'],
        ];
    }

    public static function nodeTypeNameProvider(): array
    {
        return [
            'Hybrid' => [NodeType::Hybrid, 'Hybrid'],
            'Physical' => [NodeType::Physical, 'Physical'],
            'Unknown' => [NodeType::Unknown, 'Unknown'],
            'Virtual' => [NodeType::Virtual, 'Virtual'],
        ];
    }
}
