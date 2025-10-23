<?php

declare(strict_types=1);

/**
 * A list of common business tiers for seeding the database.
 * Each element should contain a 'code', 'name', and a 'description'.
 */
return [
    [
        'code' => 'T0',
        'name' => 'Tier 0 - Mission-Critical',
        'description' => 'Highest criticality services. Direct, real-time impact on customers and revenue. Requires the highest level of availability and lowest latency. (e.g., Core APIs, Authentication)',
    ],
    [
        'code' => 'T1',
        'name' => 'Tier 1 - High-Impact Business',
        'description' => 'Services critical for business operations with significant customer or revenue impact. High availability is required, but with slightly more tolerance than Tier 0. (e.g., Order Processing, User Profile Management)',
    ],
    [
        'code' => 'T2',
        'name' => 'Tier 2 - Core Internal Services',
        'description' => 'Services that support internal business processes. Downtime impacts employee productivity but not directly customers. (e.g., Internal Dashboards, Reporting Services)',
    ],
    [
        'code' => 'T3',
        'name' => 'Tier 3 - Supporting & Batch Services',
        'description' => 'Services with low-urgency or asynchronous workloads. Downtime is tolerable and can often be scheduled. (e.g., Data Warehousing, Log Processing)',
    ],
    [
        'code' => 'T4',
        'name' => 'Tier 4 - Development & Experimental',
        'description' => 'Non-production services used for development, testing, or staging. No availability guarantees.',
    ],
];
