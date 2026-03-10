<?php

declare(strict_types=1);

use App\Http\Controllers\ComplianceRequirementController;
use App\Http\Controllers\ComplianceStandardController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    Route::prefix('compliance')->group(function () {

        // Compliance Domain
        //
        Route::apiResource('compliance-standards', ComplianceStandardController::class);
        Route::apiResource('standards', ComplianceStandardController::class)->names([
            'index'   => 'compliance.standards.index',
            'show'    => 'compliance.standards.show',
            'store'   => 'compliance.standards.store',
            'update'  => 'compliance.standards.update',
            'destroy' => 'compliance.standards.destroy',
        ]);
        Route::apiResource('compliance-requirements', ComplianceRequirementController::class);
    });
});
