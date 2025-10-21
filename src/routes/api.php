<?php

use App\Http\Controllers\ApiAccessPolicyController;
use App\Http\Controllers\ApiStatusController;
use App\Http\Controllers\ApiTypeController;
use App\Http\Controllers\AuthenticationMethodController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // API Domain
    Route::apiResource('api-access-policies', ApiAccessPolicyController::class);
    Route::apiResource('api-statuses', ApiStatusController::class);
    Route::apiResource('api-types', ApiTypeController::class);
    // Security Domain
    Route::apiResource('authentication-methods', AuthenticationMethodController::class);
});
