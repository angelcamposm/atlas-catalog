<?php

declare(strict_types=1);

use App\Http\Controllers\ApiAccessPolicyController;
use App\Http\Controllers\ApiCategoryController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\ApiStatusController;
use App\Http\Controllers\ApiTypeController;
use App\Http\Controllers\AuthenticationMethodController;
use App\Http\Controllers\BusinessDomainController;
use App\Http\Controllers\BusinessTierController;
use App\Http\Controllers\EnvironmentController;
use App\Http\Controllers\FrameworkController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupMemberController;
use App\Http\Controllers\GroupMemberRoleController;
use App\Http\Controllers\GroupTypeController;
use App\Http\Controllers\LifecycleController;
use App\Http\Controllers\ProgrammingLanguageController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ResourceTypeController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // API Domain
    Route::apiResource('api-access-policies', ApiAccessPolicyController::class);
    Route::apiResource('api-categories', ApiCategoryController::class);
    Route::apiResource('api-statuses', ApiStatusController::class);
    Route::apiResource('api-types', ApiTypeController::class);
    Route::apiResource('apis', ApiController::class);

    // Business Domain
    Route::apiResource('business-domains', BusinessDomainController::class);
    Route::apiResource('business-tiers', BusinessTierController::class);
    Route::apiResource('environments', EnvironmentController::class);
    Route::apiResource('lifecycles', LifecycleController::class);

    // Resource Domain
    Route::apiResource('resources', ResourceController::class);
    Route::apiResource('resource-types', ResourceTypeController::class);

    // Security Domain
    Route::apiResource('authentication-methods', AuthenticationMethodController::class);

    // Technology Domain
    Route::apiResource('frameworks', FrameworkController::class);
    Route::apiResource('programming-languages', ProgrammingLanguageController::class);
    Route::apiResource('vendors', VendorController::class);

    // Account Domain
    Route::apiResource('groups', GroupController::class);
    Route::apiResource('group-members', GroupMemberController::class);
    Route::apiResource('group-member-roles', GroupMemberRoleController::class);
    Route::apiResource('group-types', GroupTypeController::class);
});
