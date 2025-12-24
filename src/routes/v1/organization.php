<?php

declare(strict_types=1);

use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupMemberRoleController;
use App\Http\Controllers\GroupTypeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('organization')->group(function () {
        // Account Domain
        //
        Route::apiResource('groups/member-roles', GroupMemberRoleController::class);
        Route::apiResource('groups/types', GroupTypeController::class);
        Route::apiResource('groups', GroupController::class);
        Route::apiResource('users', UserController::class);
    });
});
