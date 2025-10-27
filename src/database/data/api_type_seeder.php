<?php

declare(strict_types=1);

/**
 * A list of common API types.
 */
return [
    [
        'name' => 'REST',
        'description' => 'Representational State Transfer. An architectural style for providing standards between computer systems on the web, making it easier for systems to communicate with each other.',
    ],
    [
        'name' => 'GraphQL',
        'description' => 'A query language for APIs and a runtime for fulfilling those queries with your existing data. It gives clients the power to ask for exactly what they need and nothing more.',
    ],
    [
        'name' => 'gRPC',
        'description' => 'A high-performance, open-source universal RPC framework developed by Google. It uses HTTP/2 for transport and Protocol Buffers as the interface description language.',
    ],
    [
        'name' => 'SOAP',
        'description' => 'Simple Object Access Protocol. A protocol for exchanging structured information in the implementation of web services in computer networks. It uses XML for its message format.',
    ],
    [
        'name' => 'WebSockets',
        'description' => 'A computer communications protocol providing full-duplex communication channels over a single TCP connection, designed to be implemented in web browsers and web servers.',
    ],
    [
        'name' => 'Webhooks',
        'description' => 'An automated message sent from apps when something happens. It has a message (payload) and is sent to a unique URL—a webhook URL.',
    ],
    [
        'name' => 'JSON-RPC',
        'description' => 'A remote procedure call protocol encoded in JSON. It is a very simple protocol, defining only a few data types and commands.',
    ],
    [
        'name' => 'XML-RPC',
        'description' => 'A remote procedure call protocol which uses XML to encode its calls and HTTP as a transport mechanism. It\'s a predecessor to SOAP.',
    ],
    [
        'name' => 'Avro',
        'description' => 'A data serialization system that uses JSON for defining data types and protocols, and serializes data in a compact binary format. Often used with Kafka.',
    ],
];
