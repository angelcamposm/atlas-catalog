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
    #[DataProvider('protocolNameProvider')]
    public function it_returns_the_correct_display_name(Protocol $protocol, string $displayName): void
    {
        $this->assertSame($displayName, $protocol->displayName());
    }

    #[Test]
    #[DataProvider('protocolSecurityProvider')]
    public function it_correctly_identifies_if_a_protocol_is_secure(Protocol $protocol, bool $isSecure): void
    {
        $this->assertSame($isSecure, $protocol->isSecure());
    }

    #[Test]
    #[DataProvider('protocolPortProvider')]
    public function it_returns_the_correct_default_port(Protocol $protocol, int $port): void
    {
        $this->assertSame($port, $protocol->defaultPort());
    }

    public static function protocolNameProvider(): array
    {
        return [
            'HTTP' => [Protocol::Http, 'HTTP'],
            'HTTPS' => [Protocol::Https, 'HTTPS'],
            'WebSocket' => [Protocol::WebSocket, 'WebSocket'],
            'WebSocket Secure' => [Protocol::Wss, 'WebSocket Secure'],
        ];
    }

    public static function protocolSecurityProvider(): array
    {
        return [
            'HTTP' => [Protocol::Http, false],
            'HTTPS' => [Protocol::Https, true],
            'WebSocket' => [Protocol::WebSocket, false],
            'WebSocket Secure' => [Protocol::Wss, true],
        ];
    }

    public static function protocolPortProvider(): array
    {
        return [
            'HTTP' => [Protocol::Http, 80],
            'HTTPS' => [Protocol::Https, 443],
            'WebSocket' => [Protocol::WebSocket, 80],
            'WebSocket Secure' => [Protocol::Wss, 443],
        ];
    }
}
