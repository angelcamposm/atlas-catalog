<?php

declare(strict_types=1);

use App\Http\Controllers\DeploymentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('webhooks')->middleware(['throttle:webhooks', 'webhook.token'])->group(function () {
        Route::post('deployments', [DeploymentController::class, 'store'])
            ->name('webhooks.deployments.store');
    });
});
