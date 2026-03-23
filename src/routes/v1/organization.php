<?php

declare(strict_types=1);

use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupMemberRoleController;
use App\Http\Controllers\GroupTypeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    Route::prefix('organization')->group(function () {
        // Account Domain
        //
        Route::apiResource('groups/member-roles', GroupMemberRoleController::class);
        Route::apiResource('groups/types', GroupTypeController::class);
        Route::apiResource('group-types', GroupTypeController::class)->names([
            'index'   => 'organization.group-types.index',
            'show'    => 'organization.group-types.show',
            'store'   => 'organization.group-types.store',
            'update'  => 'organization.group-types.update',
            'destroy' => 'organization.group-types.destroy',
        ]);
        Route::apiResource('group-member-roles', GroupMemberRoleController::class)->parameters(['group-member-roles' => 'member_role'])->names([
            'index'   => 'organization.group-member-roles.index',
            'show'    => 'organization.group-member-roles.show',
            'store'   => 'organization.group-member-roles.store',
            'update'  => 'organization.group-member-roles.update',
            'destroy' => 'organization.group-member-roles.destroy',
        ]);
        Route::apiResource('groups', GroupController::class);
        Route::apiResource('users', UserController::class);
    });
});
