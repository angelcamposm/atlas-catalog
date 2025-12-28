<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the communication style of a component or service.
 */
enum CommunicationStyle: string
{
    /**
     * A synchronous, request/response style of communication where the client
     * sends a request and waits for a response.
     * Examples: HTTP/REST, gRPC.
     */
    case Synchronous = 'synchronous';

    /**
     * An asynchronous, event-driven style of communication where the client
     * sends an event or message without waiting for a direct response.
     * Examples: Message Queues (RabbitMQ), Event Streams (Kafka).
     */
    case Asynchronous = 'asynchronous';

    /**
     * Returns the human-readable name of the style.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::Synchronous => 'Synchronous',
            self::Asynchronous => 'Asynchronous',
        };
    }

    /**
     * Returns a detailed description of the style.
     */
    public function description(): string
    {
        return match ($this) {
            self::Synchronous => 'A synchronous, request/response style of communication where the client sends a request and waits for a response.',
            self::Asynchronous => 'An asynchronous, event-driven style of communication where the client sends an event or message without waiting for a direct response.',
        };
    }

    /**
     * Returns an icon name associated with the style for UI purposes.
     */
    public function icon(): string
    {
        return match ($this) {
            self::Synchronous => 'sync',
            self::Asynchronous => 'paper-plane',
        };
    }

    /**
     * Returns the typical authentication schemes associated with the style.
     *
     * @return array<int, string>
     */
    public function supportedAuthenticationSchemes(): array
    {
        return match ($this) {
            self::Synchronous => ['OAuth2', 'JWT', 'Basic', 'API Key'],
            self::Asynchronous => ['mTLS', 'SASL', 'DTLS', 'None (Internal)'],
        };
    }
}
