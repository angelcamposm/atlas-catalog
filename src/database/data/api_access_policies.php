<?php

declare(strict_types=1);

/**
 * A list of common API access policies from an API management perspective.
 */
return [
    [
        'name' => 'Public API',
        'description' => 'Open to any developer or user without authentication. Used for public data and services that do not require access control, though often subject to rate limits or a pricing plan.',
    ],
    [
        'name' => 'Internal API',
        'description' => 'Restricted to internal applications and services within the organization. Not exposed to external parties and often relies on network-level security.',
    ],
    [
        'name' => 'Partner API',
        'description' => 'Exposed only to specific, trusted business partners. Access is controlled by formal agreements and is not available to the general public.',
    ],
    [
        'name' => 'Composite API',
        'description' => 'A type of API that combines multiple separate API calls (which could be to internal or partner APIs) into a single API request. This simplifies the logic for the client application.',
    ]
];
