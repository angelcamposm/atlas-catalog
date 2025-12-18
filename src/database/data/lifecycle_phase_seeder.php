<?php

declare(strict_types=1);

return [
    [
        'name' => 'Experimental',
        'description' => 'An experiment or early, non-production component, signaling that users may not prefer to consume it over other more established components, or that there are low or no reliability guarantees',
        'color' => 'primary',
    ],
    [
        'name' => 'Plan',
        'description' => 'The application or component is still in the planning state and is not clear whether it will be implemented or developed.'
    ],
    [
        'name' => 'Phase in',
        'description' => 'A new component or application that is currently in development phase.',
        'color' => 'warning',
    ],
    [
        'name' => 'In testing',
        'description' => 'The application undergoes comprehensive testing to ensure quality and functionality.',
        'color' => '',
    ],
    [
        'name' => 'Phase out',
        'description' => 'The application is officially retired from service.',
        'color' => 'dark',
    ],
    [
        'name' => 'Active',
        'description' => 'The application or component is productive and in use.',
        'color' => 'success',
    ],
    [
        'name' => 'End of life',
        'description' => 'The application or component is at the end of its lifecycle, can not be used anymore, and may disappear at a later point in time.',
        'color' => 'danger',
    ],
];
