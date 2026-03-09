<?php

declare(strict_types=1);

/**
 * A list of common API authentication methods from an API management perspective.
 */
return [
    [
        'name' => 'No Auth (Public)',
        'description' => 'The API is publicly accessible and requires no authentication credentials.',
    ],
    [
        'name' => 'Basic Auth',
        'description' => 'A simple authentication scheme built into the HTTP protocol. The client sends HTTP requests with the Authorization header that contains the word Basic word followed by a space and a base64-encoded string username:password.',
    ],
    [
        'name' => 'Digest Auth',
        'description' => 'An authentication method that negotiates credentials by sending a hash of the username, password, and nonce, rather than sending the password in cleartext.',
    ],
    [
        'name' => 'API Key',
        'description' => 'A secret token used to identify the consuming application. Typically passed in a request header (e.g., X-API-Key), query parameter, or body.',
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
    [
        'name' => 'Mutual TLS (mTLS)',
        'description' => 'A method where both the client and server authenticate each other using digital certificates (X.509).',
    ],
    [
        'name' => 'HMAC Signature',
        'description' => 'Hash-based Message Authentication Code. The client signs the request using a secret key, ensuring both authenticity and integrity.',
    ],
    [
        'name' => 'AWS Signature v4',
        'description' => 'The protocol used to authenticate requests to AWS services, involving a complex signing process with canonical requests and string-to-sign.',
    ],
];
