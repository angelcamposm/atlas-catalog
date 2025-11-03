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
use App\Http\Controllers\ClusterController;
use App\Http\Controllers\ClusterTypeController;
use App\Http\Controllers\ComplianceStandardController;
use App\Http\Controllers\EnvironmentController;
use App\Http\Controllers\FrameworkController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupMemberRoleController;
use App\Http\Controllers\GroupTypeController;
use App\Http\Controllers\LifecycleController;
use App\Http\Controllers\LinkCategoryController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\NodeController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\ProgrammingLanguageController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ResourceCategoryController;
use App\Http\Controllers\ServiceAccountController;
use App\Http\Controllers\ServiceStatusController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // API Domain
    Route::apiResource('apis/access-policies', ApiAccessPolicyController::class);
    Route::apiResource('apis/categories', ApiCategoryController::class);
    Route::apiResource('apis/statuses', ApiStatusController::class);
    Route::apiResource('apis/types', ApiTypeController::class);
    Route::apiResource('apis', ApiController::class);

    // Business Domain
    Route::apiResource('business-domains', BusinessDomainController::class);
    Route::apiResource('business-tiers', BusinessTierController::class);
    Route::apiResource('environments', EnvironmentController::class);
    Route::apiResource('lifecycles', LifecycleController::class);

    // Compliance Domain
    Route::apiResource('compliance-standards', ComplianceStandardController::class);

    // Link Domain
    Route::apiResource('links/categories', LinkCategoryController::class);
    Route::apiResource('links', LinkController::class);

    // Operation Domain
    Route::apiResource('service-statuses', ServiceStatusController::class);

    // Resource Domain
    Route::apiResource('resources/categories', ResourceCategoryController::class);
    Route::apiResource('resources', ResourceController::class);

    // Security Domain
    Route::apiResource('authentication-methods', AuthenticationMethodController::class);
    Route::apiResource('service-accounts', ServiceAccountController::class);

    // Technology Domain
    Route::apiResource('clusters/types', ClusterTypeController::class);
    Route::apiResource('clusters', ClusterController::class);
    Route::apiResource('frameworks', FrameworkController::class);
    Route::apiResource('nodes', NodeController::class);
    Route::apiResource('platforms', PlatformController::class);
    Route::apiResource('programming-languages', ProgrammingLanguageController::class);
    Route::apiResource('resources/categories', ResourceCategoryController::class);
    Route::apiResource('resources', ResourceController::class);
    Route::apiResource('vendors', VendorController::class);

    // Account Domain
    Route::apiResource('groups/member-roles', GroupMemberRoleController::class);
    Route::apiResource('groups/types', GroupTypeController::class);
    Route::apiResource('groups', GroupController::class);
});
