<?php

declare(strict_types=1);

/**
 * A list of common API statuses from an API management lifecycle perspective.
 */
return [
    [
        'name' => 'Draft',
        'description' => 'The API is defined and in the design phase but is not yet published or available for consumption.',
    ],
    [
        'name' => 'Published',
        'description' => 'The API is live, actively managed, and available for consumers to subscribe to and use.',
    ],
    [
        'name' => 'Deprecated',
        'description' => 'The API is scheduled for retirement and will be removed in a future version. Consumers should migrate to a newer version.',
    ],
    [
        'name' => 'Retired',
        'description' => 'The API is no longer available for use and all support has been discontinued. It cannot be invoked.',
    ],
    [
        'name' => 'Blocked',
        'description' => 'Access to the API is temporarily suspended due to security concerns, policy violations, or other administrative reasons.',
    ],
];
