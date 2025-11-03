<?php

declare(strict_types=1);

/**
 * A list of common service statuses from an operational perspective.
 */
return [
    [
        'name' => 'Operational',
        'description' => 'The service is live, fully functional, and meeting all performance targets.',
        'allow_deployments' => true,
        'icon' => 'check-circle',
    ],
    [
        'name' => 'Under Observation',
        'description' => 'The service is operational but being closely monitored, often after a recent deployment or incident.',
        'allow_deployments' => true,
        'icon' => 'eye',
    ],
    [
        'name' => 'Degraded Performance',
        'description' => 'The service is operational but experiencing performance issues (e.g., high latency). Functionality is not impacted.',
        'allow_deployments' => false,
        'icon' => 'exclamation-triangle',
    ],
    [
        'name' => 'Partial Outage',
        'description' => 'One or more non-critical features of the service are unavailable. Core functionality is still operational.',
        'allow_deployments' => false,
        'icon' => 'minus-circle',
    ],
    [
        'name' => 'Major Outage',
        'description' => 'The service is experiencing a critical failure, making it completely unavailable or unusable.',
        'allow_deployments' => false,
        'icon' => 'times-circle',
    ],
    [
        'name' => 'Under Maintenance',
        'description' => 'The service is temporarily unavailable due to planned maintenance activities.',
        'allow_deployments' => false,
        'icon' => 'wrench',
    ],
];
