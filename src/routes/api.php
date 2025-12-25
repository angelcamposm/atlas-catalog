<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

/**
 * Architecture Domain
 *
 * Routes related to high-level system design, including business domains,
 * capabilities, and architectural tiers.
 */
include_once 'v1/architecture.php';

/**
 * Catalog Domain
 *
 * Routes for the core service catalog, managing components, APIs,
 * resources, and their associated metadata.
 */
include_once 'v1/catalog.php';

/**
 * CI/CD Domain
 *
 * Routes for Continuous Integration and Continuous Deployment, handling
 * workflows, jobs, runs, and pipeline integrations.
 */
include_once 'v1/ci-cd.php';

/**
 * Compliance Domain
 *
 * Routes for managing regulatory standards, compliance checks, and
 * governance requirements.
 */
include_once 'v1/compliance.php';

/**
 * Infrastructure Domain
 *
 * Routes for managing physical and virtual infrastructure, including
 * clusters, nodes, environments, and platforms.
 */
include_once 'v1/infrastructure.php';

/**
 * Operations Domain
 *
 * Routes for tracking the operational status, health, availability,
 * and incidents of system components and infrastructure.
 */
include_once 'v1/operations.php';

/**
 * Organization Domain
 *
 * Routes for managing the organizational structure, including groups,
 * teams, members, and their roles.
 */
include_once 'v1/organization.php';

/**
 * Security Domain
 *
 * Routes for security management, including authentication methods,
 * access policies, and service accounts.
 */
include_once 'v1/security.php';

Route::prefix('v1')->group(function () {
    // Global routes or version-specific configurations can go here
});
