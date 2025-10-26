<?php

namespace App\Enums;

enum Protocol: string
{
    case Http = 'http';
    case Https = 'https';
    case WebSocket = 'ws';
    case Wss = 'wss';

    /**
     * Returns the human-readable name of the enumeration value.
     *
     * @return string
     */
    public function displayName(): string
    {
        return match($this) {
            self::Http => 'HTTP',
            self::Https => 'HTTPS',
            self::WebSocket => 'WebSocket',
            self::Wss => 'WebSocket Secure'
        };
    }
}
