<?php

declare(strict_types=1);

use App\Enums\ApiAccessPolicy;
use App\Http\Controllers\ApiAccessPolicyController;
use App\Http\Controllers\ApiCategoryController;
use App\Http\Controllers\ApiComponentController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\ApiTypeController;
use App\Http\Controllers\ComponentController;
use App\Http\Controllers\ComponentTypeController;
use App\Http\Controllers\EnvironmentController;
use App\Http\Controllers\FrameworkController;
use App\Http\Controllers\LinkCategoryController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\PlatformComponentController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\ProgrammingLanguageController;
use App\Http\Controllers\ResourceCategoryController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ServiceModelController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('catalog')->group(function () {

        // API Domain
        //
        Route::get('apis/access-policies', [ApiAccessPolicyController::class, 'index'])
            ->name('api-access-policies.index');
        Route::get('apis/access-policies/{policy}', [ApiAccessPolicyController::class, 'show'])
            ->whereIn('policy', ApiAccessPolicy::cases())
            ->name('api-access-policies.show');
        Route::get('apis/access-policies/{id}/apis', [])
            ->whereIn('id', ApiAccessPolicy::cases())
            ->name('api-access-policies.apis');
        Route::get('apis/{api}/components', ApiComponentController::class)
            ->whereNumber('api')
            ->name('apis.components');
        Route::apiResource('apis/categories', ApiCategoryController::class);
        Route::apiResource('apis/types', ApiTypeController::class);
        Route::apiResource('apis', ApiController::class);

        Route::apiResource('components', ComponentController::class);
        Route::apiResource('components/types', ComponentTypeController::class);

        Route::apiResource('environments', EnvironmentController::class);

        // Frameworks
        //
        Route::apiResource('frameworks', FrameworkController::class);
//        Route::get('frameworks/{framework}/components')
//            ->name('frameworks.components');

        // Link Domain
        //
        Route::apiResource('links/categories', LinkCategoryController::class);
        Route::apiResource('links', LinkController::class);

        // Platforms
        //
        Route::apiResource('platforms', PlatformController::class);
        Route::get('platforms/{platform}/components', PlatformComponentController::class)
            ->name('platforms.components');

        Route::apiResource('programming-languages', ProgrammingLanguageController::class);

        // Resource Domain
        //
        Route::apiResource('resources', ResourceController::class);
        Route::apiResource('resources/categories', ResourceCategoryController::class);

        // Service Models
        Route::apiResource('service-models', ServiceModelController::class);
    });
});
