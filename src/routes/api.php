<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\TokenController;
use Illuminate\Support\Facades\Route;

/**
 * Architecture Domain
 *
 * Routes related to high-level system design, including business domains,
 * capabilities, and architectural tiers.
 */
require __DIR__.'/v1/architecture.php';

/**
 * Catalog Domain
 *
 * Routes for the core service catalog, managing components, APIs,
 * resources, and their associated metadata.
 */
require __DIR__.'/v1/catalog.php';

/**
 * CI/CD Domain
 *
 * Routes for Continuous Integration and Continuous Deployment, handling
 * workflows, jobs, runs, and pipeline integrations.
 */
require __DIR__.'/v1/ci-cd.php';

/**
 * Compliance Domain
 *
 * Routes for managing regulatory standards, compliance checks, and
 * governance requirements.
 */
require __DIR__.'/v1/compliance.php';

/**
 * Infrastructure Domain
 *
 * Routes for managing physical and virtual infrastructure, including
 * clusters, nodes, environments, and platforms.
 */
require __DIR__.'/v1/infrastructure.php';

/**
 * Operations Domain
 *
 * Routes for tracking the operational status, health, availability,
 * and incidents of system components and infrastructure.
 */
require __DIR__.'/v1/operations.php';

/**
 * Organization Domain
 *
 * Routes for managing the organizational structure, including groups,
 * teams, members, and their roles.
 */
require __DIR__.'/v1/organization.php';

/**
 * Security Domain
 *
 * Routes for security management, including authentication methods,
 * access policies, and service accounts.
 */
require __DIR__.'/v1/security.php';

/**
 * Webhooks Domain
 *
 * Routes for inbound events from external systems such as CI/CD platforms.
 */
require __DIR__.'/v1/webhooks.php';

Route::prefix('v1')->group(function () {
    /**
     * Authentication Routes
     *
     * Public endpoints for login and registration.
     */
    Route::post('auth/login', LoginController::class)->name('auth.login');
    Route::post('auth/register', RegisterController::class)->name('auth.register');

    /**
     * Protected Authentication Routes
     *
     * Endpoints requiring authentication for user profile and logout.
     */
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('auth/me', [TokenController::class, 'show'])->name('auth.me');
        Route::post('auth/logout', [TokenController::class, 'destroy'])->name('auth.logout');
    });
});
