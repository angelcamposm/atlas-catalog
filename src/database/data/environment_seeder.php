<?php

declare(strict_types=1);

return [
    [
        'name' => 'Development',
        'abbr' => 'dev',
        'approval_required' => false,
        'description' => 'Environment for active development and testing by the development team.',
        'display_in_matrix' => true,
        'sort_order' => 10,
    ],
    [
        'name' => 'Integration',
        'abbr' => 'int',
        'approval_required' => false,
        'description' => 'Environment dedicated to testing integration between different systems and components.',
        'display_in_matrix' => true,
        'sort_order' => 20,
    ],
    [
        'name' => 'Acceptance Testing',
        'abbr' => 'uat',
        'approval_required' => false,
        'description' => 'Environment for quality assurance and user acceptance testing.',
        'display_in_matrix' => true,
        'sort_order' => 30,
    ],
    [
        'name' => 'Staging',
        'abbr' => 'stg',
        'approval_required' => false,
        'description' => 'A pre-production environment that mirrors the production setup.',
        'display_in_matrix' => true,
        'sort_order' => 40,
    ],
    [
        'name' => 'Production',
        'abbr' => 'pro',
        'approval_required' => true,
        'description' => 'The live environment accessed by end-users.',
        'display_in_matrix' => true,
        'sort_order' => 50,
    ],
    [
        'name' => 'Sandbox',
        'abbr' => 'sbx',
        'approval_required' => false,
        'description' => 'An isolated environment for experimentation and testing without affecting other environments.',
        'display_in_matrix' => false,
        'sort_order' => 0,
    ],
];
