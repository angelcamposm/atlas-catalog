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
}
