<?php

use App\Http\Controllers\ApiStatusController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('api-statuses', ApiStatusController::class);
});
