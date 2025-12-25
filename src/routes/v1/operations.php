<?php

declare(strict_types=1);

use App\Http\Controllers\ServiceStatusController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('operations')->group(function () {
        Route::apiResource('service-statuses', ServiceStatusController::class);
    });
});
