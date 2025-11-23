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
    #[DataProvider('nodeTypeProvider')]
    public function it_returns_the_correct_display_name(NodeType $type, string $expectedName): void
    {
        $this->assertSame($expectedName, $type->displayName());
    }

    #[Test]
    #[DataProvider('nodeTypeProvider')]
    public function it_returns_the_correct_color(NodeType $type, string $expectedName, string $expectedColor): void
    {
        $this->assertSame($expectedColor, $type->color());
    }

    public static function nodeTypeProvider(): array
    {
        return [
            'Hybrid' => [NodeType::Hybrid, 'Hybrid', 'purple'],
            'Physical' => [NodeType::Physical, 'Physical', 'blue'],
            'Unknown' => [NodeType::Unknown, 'Unknown', 'gray'],
            'Virtual' => [NodeType::Virtual, 'Virtual', 'green'],
        ];
    }
}