<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\Protocol;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Protocol::class)]
class ProtocolTest extends TestCase
{
    #[Test]
    #[DataProvider('protocolProvider')]
    public function it_returns_the_correct_display_name(Protocol $protocol, string $displayName): void
    {
        $this->assertSame($displayName, $protocol->displayName());
    }

    #[Test]
    #[DataProvider('protocolProvider')]
    public function it_correctly_identifies_if_a_protocol_is_secure(Protocol $protocol, string $displayName, bool $isSecure): void
    {
        $this->assertSame($isSecure, $protocol->isSecure());
    }

    #[Test]
    #[DataProvider('protocolProvider')]
    public function it_returns_the_correct_default_port(Protocol $protocol, string $displayName, bool $isSecure, int $port): void
    {
        $this->assertSame($port, $protocol->defaultPort());
    }

    public static function protocolProvider(): array
    {
        return [
            'HTTP' => [Protocol::Http, 'HTTP', false, 80],
            'HTTPS' => [Protocol::Https, 'HTTPS', true, 443],
            'WebSocket' => [Protocol::WebSocket, 'WebSocket', false, 80],
            'WebSocket Secure' => [Protocol::Wss, 'WebSocket Secure', true, 443],
        ];
    }
}
