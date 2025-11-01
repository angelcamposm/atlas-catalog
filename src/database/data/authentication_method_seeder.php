<?php

declare(strict_types=1);

/**
 * A list of common API authentication methods from an API management perspective.
 */
return [
    [
        'name' => 'API Key',
        'description' => 'A secret token used to identify the consuming application. Typically passed in a request header (e.g., X-API-Key).',
    ],
    [
        'name' => 'OAuth 2.0',
        'description' => 'An open standard for access delegation. Allows applications to obtain limited access to user accounts on an HTTP service.',
    ],
    [
        'name' => 'OpenID Connect (OIDC)',
        'description' => 'An identity layer on top of OAuth 2.0. It allows clients to verify the end-user\'s identity and obtain basic profile information.',
    ],
    [
        'name' => 'JWT Bearer Token',
        'description' => 'A standard for creating access tokens that assert claims. The token is signed and can be verified without a database lookup.',
    ],
];
