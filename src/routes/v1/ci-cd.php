<?php

declare(strict_types=1);

use App\Http\Controllers\CiServerController;
use App\Http\Controllers\ReleaseController;
use App\Http\Controllers\WorkflowJobController;
use App\Http\Controllers\WorkflowRunCommitController;
use App\Http\Controllers\WorkflowRunController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('ci-cd')->group(function () {

        Route::apiResource('servers', CiServerController::class);

        // Workflow Domain
        Route::apiResource('workflows/runs', WorkflowRunController::class);
        Route::apiResource('workflows/commits', WorkflowRunCommitController::class)
            ->only(['index', 'show']);
        Route::apiResource('workflows.jobs', WorkflowJobController::class)
            ->except('update');

        // Release Domain
        Route::apiResource('releases', ReleaseController::class);
    });
});
