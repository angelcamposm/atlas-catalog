<?php

declare(strict_types=1);

return [
    [
        'name' => 'Experimental',
        'description' => 'An experiment or early, non-production component, signaling that users may not prefer to consume it over other more established components, or that there are low or no reliability guarantees',
        'color' => 'primary',
    ],
    [
        'name' => 'In development',
        'description' => 'A new component that is currently in development phase.',
        'color' => 'warning',
    ],
    [
        'name' => 'In testing',
        'description' => 'The application undergoes comprehensive testing to ensure quality and functionality.',
        'color' => '',
    ],
    [
        'name' => 'In maintenance',
        'description' => 'The application does not receive new features but undergoes maintenance activities.',
        'color' => 'secondary',
    ],
    [
        'name' => 'In retirement',
        'description' => 'The application is officially retired from service.',
        'color' => 'dark',
    ],
    [
        'name' => 'In production',
        'description' => 'An established, owned, maintained component',
        'color' => 'success',
    ],
    [
        'name' => 'Obsolete',
        'description' => 'A component that is at the end of its lifecycle, and may disappear at a later point in time',
        'color' => 'danger',
    ],
];
