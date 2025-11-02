<?php

declare(strict_types=1);

return [
    /*
    | A list of common API categories.
    |
    */
    [
        'name' => 'Authentication & Authorization',
        'description' => 'APIs for user authentication, authorization, and access control. Includes login, registration, password management, and permissions.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Payments & Billing',
        'description' => 'APIs for processing payments, managing subscriptions, handling invoices, and integrating with payment gateways.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'User Management',
        'description' => 'APIs for managing user profiles, settings, preferences, and other user-related data.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Notifications',
        'description' => 'APIs for sending notifications to users via various channels like email, SMS, push notifications, and webhooks.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Data Storage & Management',
        'description' => 'APIs for interacting with databases, object storage (e.g., S3), and other data persistence layers.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Geolocation & Maps',
        'description' => 'APIs that provide location-based services, mapping, geocoding, and routing functionalities.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Search',
        'description' => 'APIs for implementing powerful search functionalities, including full-text search, filtering, and indexing.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Analytics & Monitoring',
        'description' => 'APIs for collecting, processing, and visualizing application metrics, logs, and user behavior data.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Communication',
        'description' => 'APIs for real-time communication features such as chat, video conferencing, and voice calls.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'E-commerce',
        'description' => 'APIs for building online stores, including product catalogs, shopping carts, order processing, and inventory management.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Content Management',
        'description' => 'APIs for creating, managing, and delivering digital content like articles, blog posts, images, and videos.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Social & Community',
        'description' => 'APIs for building social features like user feeds, follows, likes, comments, and sharing.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'AI & Machine Learning',
        'description' => 'APIs that expose machine learning models for tasks like prediction, classification, natural language processing, and image recognition.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'DevOps & Infrastructure',
        'description' => 'APIs for automating infrastructure, managing deployments, and interacting with CI/CD pipelines.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Third-Party Integrations',
        'description' => 'APIs designed to connect with and manage data from external services, such as social media platforms, CRMs, or marketing tools.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Reporting & Business Intelligence',
        'description' => 'APIs for generating reports, creating dashboards, and performing data analysis for business insights.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Scheduling & Calendars',
        'description' => 'APIs for managing events, booking appointments, and integrating with calendar systems.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],
    [
        'name' => 'Utilities',
        'description' => 'General-purpose APIs providing utility functions like currency conversion, data validation, or file format transformations.',
        'icon' => null,
        'model' => 'api',
        'parent_id' => null,
    ],

    /*
    | A list of common link categories from an IT perspective.
    |
    */
    [
        'name' => 'API Specification',
        'description' => 'Link to an API definition file (e.g., OpenAPI, Swagger, AsyncAPI).',
        'icon' => 'fas fa-file-code',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Chat Channel',
        'description' => 'Link to a team communication channel (e.g., Slack, Microsoft Teams).',
        'icon' => 'fas fa-comments',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Documentation',
        'description' => 'Link to official documentation, such as a wiki, Confluence page, or read-me file.',
        'icon' => 'fas fa-book',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Documentation Repository',
        'description' => 'Link to a repository containing documentation source files (e.g., Markdown, AsciiDoc).',
        'icon' => 'fab fa-git-alt',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Configuration as Code (CAC)',
        'description' => 'Link to a repository containing configuration files that define application settings and environment parameters as code.',
        'icon' => 'fas fa-cogs',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Infrastructure as Code (IaC) Repository',
        'description' => 'Link to a repository containing Infrastructure as Code (IaC) definitions (e.g., Terraform, Ansible, Helm, Kustomize).',
        'icon' => 'fab fa-git-alt',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Monitoring',
        'description' => 'Link to a monitoring or observability dashboard (e.g., Grafana, Datadog, New Relic).',
        'icon' => 'fas fa-chart-line',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Project Board',
        'description' => 'Link to a project management board (e.g., Jira, Trello, Asana).',
        'icon' => 'fas fa-tasks',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Runbook',
        'description' => 'Link to operational procedures or runbooks for incident response.',
        'icon' => 'fas fa-file-medical-alt',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Source Code Repository',
        'description' => 'Link to the primary repository containing the application or service source code.',
        'icon' => 'fab fa-git-alt',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Test Repository',
        'description' => 'Link to a repository containing automated tests, performance tests, or other quality assurance assets.',
        'icon' => 'fab fa-git-alt',
        'model' => 'link',
        'parent_id' => null,
    ],
    [
        'name' => 'Website',
        'description' => 'Link to a public-facing website or landing page.',
        'icon' => 'fas fa-globe',
        'model' => 'link',
        'parent_id' => null,
    ],

    /*
    | A list of common tool categories from an IT perspective.
    |
    */
    [
        'name' => 'Monitoring & Observability',
        'description' => 'Tools for tracking application performance, logs, metrics, and traces to ensure system health and reliability.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'CI/CD & Automation',
        'description' => 'Tools for continuous integration, delivery, and deployment, automating the software build, test, and release process.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'Project Management & Collaboration',
        'description' => 'Tools for planning work, tracking progress, and facilitating team communication and knowledge sharing.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'Code Quality & Analysis',
        'description' => 'Tools for static code analysis, security scanning, and measuring code coverage to maintain code health.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'Infrastructure & Provisioning',
        'description' => 'Tools for defining, deploying, and managing infrastructure as code (IaC) across various environments.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'Containerization & Orchestration',
        'description' => 'Tools for creating, managing, and orchestrating containerized applications, such as Docker and Kubernetes.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'API Development & Testing',
        'description' => 'Tools for designing, building, documenting, and testing APIs to ensure they are functional and reliable.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'Database Management',
        'description' => 'Client tools for interacting with, querying, and managing various types of databases.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'Version Control Systems',
        'description' => 'Platforms for hosting and managing source code repositories, facilitating collaborative development.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'Business Process Management (BPM)',
        'description' => 'Tools for modeling, automating, measuring, and optimizing business workflows and processes.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'Artifact Management',
        'description' => 'Repositories for storing, managing, and distributing software packages, dependencies, and build artifacts.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
    [
        'name' => 'Security & Compliance',
        'description' => 'Tools focused on vulnerability scanning, penetration testing, and ensuring compliance with security standards.',
        'icon' => null,
        'model' => 'tool',
        'parent_id' => null,
    ],
];
