<?php

declare(strict_types=1);

use App\Http\Controllers\Webhooks\DeploymentWebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['throttle:webhooks', 'verify.webhook.token'])
    ->group(function (): void {
        Route::prefix('webhooks')->group(function (): void {
            Route::post('deployments', DeploymentWebhookController::class)
                ->name('webhooks.deployments.store');
        });
    });
