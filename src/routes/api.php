<?php

use App\Http\Controllers\ApiAccessPolicyController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\ApiStatusController;
use App\Http\Controllers\ApiTypeController;
use App\Http\Controllers\AuthenticationMethodController;
use App\Http\Controllers\BusinessDomainController;
use App\Http\Controllers\LifecycleController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // API Domain
    Route::apiResource('api-access-policies', ApiAccessPolicyController::class);
    Route::apiResource('api-statuses', ApiStatusController::class);
    Route::apiResource('api-types', ApiTypeController::class);
    Route::apiResource('apis', ApiController::class);

    // Business Domain
    Route::apiResource('business-domains', BusinessDomainController::class);
    Route::apiResource('lifecycles', LifecycleController::class);

    // Security Domain
    Route::apiResource('authentication-methods', AuthenticationMethodController::class);
});
