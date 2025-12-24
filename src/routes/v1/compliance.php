<?php

declare(strict_types=1);

use App\Http\Controllers\ComplianceStandardController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('compliance')->group(function () {

        // Compliance Domain
        //
        Route::apiResource('compliance-standards', ComplianceStandardController::class);
    });
});
