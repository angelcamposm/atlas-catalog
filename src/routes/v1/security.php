<?php

declare(strict_types=1);

use App\Http\Controllers\AuthenticationMethodController;
use App\Http\Controllers\ServiceAccountController;
use App\Http\Controllers\ServiceAccountTokenController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('security')->group(function () {
        // Security Domain
        //
        Route::apiResource('authentication-methods', AuthenticationMethodController::class);
        Route::apiResource('service-accounts/tokens', ServiceAccountTokenController::class);
        Route::apiResource('service-accounts', ServiceAccountController::class);
    });
});
