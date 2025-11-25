<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\CommunicationStyle;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(CommunicationStyle::class)]
class CommunicationStyleTest extends TestCase
{
    #[Test]
    #[DataProvider('styleNameProvider')]
    public function it_returns_the_correct_display_name(CommunicationStyle $style, string $expectedName): void
    {
        $this->assertSame($expectedName, $style->displayName());
    }

    #[Test]
    #[DataProvider('styleDescriptionProvider')]
    public function it_returns_the_correct_description(CommunicationStyle $style, string $expectedDescription): void
    {
        $this->assertSame($expectedDescription, $style->description());
    }

    #[Test]
    #[DataProvider('styleIconProvider')]
    public function it_returns_the_correct_icon(CommunicationStyle $style, string $expectedIcon): void
    {
        $this->assertSame($expectedIcon, $style->icon());
    }

    public static function styleIconProvider(): array
    {
        return [
            'Synchronous' => [CommunicationStyle::Synchronous, 'sync'],
            'Asynchronous' => [CommunicationStyle::Asynchronous, 'paper-plane'],
        ];
    }

    public static function styleDescriptionProvider(): array
    {
        return [
            'Synchronous' => [
                CommunicationStyle::Synchronous,
                'A synchronous, request/response style of communication where the client sends a request and waits for a response.',
            ],
            'Asynchronous' => [
                CommunicationStyle::Asynchronous,
                'An asynchronous, event-driven style of communication where the client sends an event or message without waiting for a direct response.',
            ],
        ];
    }

    public static function styleNameProvider(): array
    {
        return [
            'Synchronous' => [CommunicationStyle::Synchronous, 'Synchronous'],
            'Asynchronous' => [CommunicationStyle::Asynchronous, 'Asynchronous'],
        ];
    }
}
