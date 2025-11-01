<?php

declare(strict_types=1);

return [
    [
        'name' => 'Backend For Frontend (BFF)',
        'description' => 'A dedicated backend service that aggregates data from multiple downstream services to serve a specific frontend application or user experience.',
    ],
    [
        'name' => 'Database Proxy',
        'description' => 'An intermediary service that manages database connections, offloads query processing, or provides a unified access layer to one or more databases.',
    ],
    [
        'name' => 'Service',
        'description' => 'A general-purpose, standalone component that provides a specific business capability and communicates over well-defined APIs.',
    ],
    [
        'name' => 'Proxy',
        'description' => 'An intermediary server that forwards client requests to other services, often used for load balancing, caching, or security.',
    ],
    [
        'name' => 'Web Application',
        'description' => 'A client-facing application accessed via a web browser, providing a user interface to interact with backend services.',
    ],
    [
        'name' => 'Micro Service',
        'description' => 'A small, autonomous service that works with other services to build a larger application, focused on a single business domain.',
    ],
    [
        'name' => 'Anti-Corruption Layer (ACL)',
        'description' => 'A layer of code that acts as a translator between a modern application and a legacy or external system, preventing the legacy design from "corrupting" the new model.',
    ],
];
