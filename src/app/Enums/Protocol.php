<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the network protocols for communication.
 */
enum Protocol: string
{
    case Http = 'http';
    case Https = 'https';
    case WebSocket = 'ws';
    case Wss = 'wss';

    /**
     * Returns the human-readable name of the enumeration value.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::Http => 'HTTP',
            self::Https => 'HTTPS',
            self::WebSocket => 'WebSocket',
            self::Wss => 'WebSocket Secure'
        };
    }

    /**
     * Determines if the protocol is secure (uses TLS).
     */
    public function isSecure(): bool
    {
        return match ($this) {
            self::Https, self::Wss => true,
            self::Http, self::WebSocket => false,
        };
    }

    /**
     * Returns the default port for the protocol.
     */
    public function defaultPort(): int
    {
        return match ($this) {
            self::Http, self::WebSocket => 80,
            self::Https, self::Wss => 443,
        };
    }
}
