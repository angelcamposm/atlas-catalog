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
use App\Http\Controllers\FrameworkComponentController;
use App\Http\Controllers\FrameworkController;
use App\Http\Controllers\LinkCategoryController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\PlatformComponentController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\ProgrammingLanguageController;
use App\Http\Controllers\ResourceCategoryController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ServiceModelController;
use App\Http\Controllers\ServiceStatusController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\LifecyclePhaseController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('catalog')->group(function () {
        $apiAccessPolicyValues = array_column(ApiAccessPolicy::cases(), 'value');

        // Public GET routes (no authentication required)
        //
        Route::get('apis/access-policies', [ApiAccessPolicyController::class, 'index'])
            ->name('api-access-policies.index');
        Route::get('apis/access-policies/{id}', [ApiAccessPolicyController::class, 'show'])
            ->whereIn('id', $apiAccessPolicyValues)
            ->name('api-access-policies.show');
        Route::get('apis/access-policies/{id}/apis', [ApiAccessPolicyController::class, 'apis'])
            ->whereIn('id', $apiAccessPolicyValues)
            ->name('api-access-policies.apis');
        Route::get('apis/{api}/components', ApiComponentController::class)
            ->whereNumber('api')
            ->name('apis.components');
        Route::get('apis/categories', [ApiCategoryController::class, 'index'])
            ->name('apis.categories.index');
        Route::get('apis/categories/{api_category}', [ApiCategoryController::class, 'show'])
            ->name('apis.categories.show');
        Route::get('apis/types', [ApiTypeController::class, 'index'])
            ->name('apis.types.index');
        Route::get('apis/types/{api_type}', [ApiTypeController::class, 'show'])
            ->name('apis.types.show');
        Route::get('apis', [ApiController::class, 'index'])
            ->name('apis.index');
        Route::get('apis/{api}', [ApiController::class, 'show'])
            ->name('apis.show');

        // Component Types MUST come before Components to avoid route model binding conflicts
        Route::get('components/types', [ComponentTypeController::class, 'index'])
            ->name('components.types.index');
        Route::get('components/types/{component_type}', [ComponentTypeController::class, 'show'])
            ->name('components.types.show');

        Route::get('environments', [EnvironmentController::class, 'index'])
            ->name('environments.index');
        Route::get('environments/{environment}', [EnvironmentController::class, 'show'])
            ->name('environments.show');

        // Frameworks
        //
        Route::get('frameworks', [FrameworkController::class, 'index'])
            ->name('frameworks.index');
        Route::get('frameworks/{framework}', [FrameworkController::class, 'show'])
            ->name('frameworks.show');
        Route::get('frameworks/{framework}/components', FrameworkComponentController::class)
            ->name('frameworks.components');

        // Link Domain
        //
        Route::get('links/categories', [LinkCategoryController::class, 'index'])
            ->name('links.categories.index');
        Route::get('links/categories/{link_category}', [LinkCategoryController::class, 'show'])
            ->name('links.categories.show');
        Route::get('links', [LinkController::class, 'index'])
            ->name('links.index');
        Route::get('links/{link}', [LinkController::class, 'show'])
            ->name('links.show');

        // Platforms
        //
        Route::get('platforms', [PlatformController::class, 'index'])
            ->name('platforms.index');
        Route::get('platforms/{platform}', [PlatformController::class, 'show'])
            ->name('platforms.show');
        Route::get('platforms/{platform}/components', PlatformComponentController::class)
            ->name('platforms.components');

        Route::get('programming-languages', [ProgrammingLanguageController::class, 'index'])
            ->name('programming-languages.index');
        Route::get('programming-languages/{programming_language}', [ProgrammingLanguageController::class, 'show'])
            ->name('programming-languages.show');

        // Resource Domain
        //
        Route::get('resources', [ResourceController::class, 'index'])
            ->name('resources.index');
        Route::get('resources/{resource}', [ResourceController::class, 'show'])
            ->name('resources.show');
        Route::get('resources/categories', [ResourceCategoryController::class, 'index'])
            ->name('resources.categories.index');
        Route::get('resources/categories/{resource_category}', [ResourceCategoryController::class, 'show'])
            ->name('resources.categories.show');

        // Service Models
        Route::get('service-models', [ServiceModelController::class, 'index'])
            ->name('service-models.index');
        Route::get('service-models/{service_model}', [ServiceModelController::class, 'show'])
            ->name('service-models.show');

        // Protected routes (authentication required)
        //
        Route::middleware(['auth:sanctum'])->group(function () {
            Route::get('components', [ComponentController::class, 'index'])
                ->name('components.index');
            Route::get('components/{component}', [ComponentController::class, 'show'])
                ->name('components.show');

            Route::post('apis/categories', [ApiCategoryController::class, 'store'])
                ->name('apis.categories.store');
            Route::put('apis/categories/{api_category}', [ApiCategoryController::class, 'update'])
                ->name('apis.categories.update');
            Route::delete('apis/categories/{api_category}', [ApiCategoryController::class, 'destroy'])
                ->name('apis.categories.destroy');

            Route::post('apis/types', [ApiTypeController::class, 'store'])
                ->name('apis.types.store');
            Route::put('apis/types/{api_type}', [ApiTypeController::class, 'update'])
                ->name('apis.types.update');
            Route::delete('apis/types/{api_type}', [ApiTypeController::class, 'destroy'])
                ->name('apis.types.destroy');

            Route::post('apis', [ApiController::class, 'store'])
                ->name('apis.store');
            Route::put('apis/{api}', [ApiController::class, 'update'])
                ->name('apis.update');
            Route::delete('apis/{api}', [ApiController::class, 'destroy'])
                ->name('apis.destroy');

            Route::post('components/types', [ComponentTypeController::class, 'store'])
                ->name('components.types.store');
            Route::put('components/types/{component_type}', [ComponentTypeController::class, 'update'])
                ->name('components.types.update');
            Route::delete('components/types/{component_type}', [ComponentTypeController::class, 'destroy'])
                ->name('components.types.destroy');

            Route::post('components', [ComponentController::class, 'store'])
                ->name('components.store');
            Route::put('components/{component}', [ComponentController::class, 'update'])
                ->name('components.update');
            Route::delete('components/{component}', [ComponentController::class, 'destroy'])
                ->name('components.destroy');

            Route::post('environments', [EnvironmentController::class, 'store'])
                ->name('environments.store');
            Route::put('environments/{environment}', [EnvironmentController::class, 'update'])
                ->name('environments.update');
            Route::delete('environments/{environment}', [EnvironmentController::class, 'destroy'])
                ->name('environments.destroy');

            Route::post('frameworks', [FrameworkController::class, 'store'])
                ->name('frameworks.store');
            Route::put('frameworks/{framework}', [FrameworkController::class, 'update'])
                ->name('frameworks.update');
            Route::delete('frameworks/{framework}', [FrameworkController::class, 'destroy'])
                ->name('frameworks.destroy');

            Route::post('links/categories', [LinkCategoryController::class, 'store'])
                ->name('links.categories.store');
            Route::put('links/categories/{link_category}', [LinkCategoryController::class, 'update'])
                ->name('links.categories.update');
            Route::delete('links/categories/{link_category}', [LinkCategoryController::class, 'destroy'])
                ->name('links.categories.destroy');

            Route::post('links', [LinkController::class, 'store'])
                ->name('links.store');
            Route::put('links/{link}', [LinkController::class, 'update'])
                ->name('links.update');
            Route::delete('links/{link}', [LinkController::class, 'destroy'])
                ->name('links.destroy');

            Route::post('platforms', [PlatformController::class, 'store'])
                ->name('platforms.store');
            Route::put('platforms/{platform}', [PlatformController::class, 'update'])
                ->name('platforms.update');
            Route::delete('platforms/{platform}', [PlatformController::class, 'destroy'])
                ->name('platforms.destroy');

            Route::post('programming-languages', [ProgrammingLanguageController::class, 'store'])
                ->name('programming-languages.store');
            Route::put('programming-languages/{programming_language}', [ProgrammingLanguageController::class, 'update'])
                ->name('programming-languages.update');
            Route::delete('programming-languages/{programming_language}', [ProgrammingLanguageController::class, 'destroy'])
                ->name('programming-languages.destroy');

            Route::post('resources', [ResourceController::class, 'store'])
                ->name('resources.store');
            Route::put('resources/{resource}', [ResourceController::class, 'update'])
                ->name('resources.update');
            Route::delete('resources/{resource}', [ResourceController::class, 'destroy'])
                ->name('resources.destroy');

            Route::post('resources/categories', [ResourceCategoryController::class, 'store'])
                ->name('resources.categories.store');
            Route::put('resources/categories/{resource_category}', [ResourceCategoryController::class, 'update'])
                ->name('resources.categories.update');
            Route::delete('resources/categories/{resource_category}', [ResourceCategoryController::class, 'destroy'])
                ->name('resources.categories.destroy');

            Route::post('service-models', [ServiceModelController::class, 'store'])
                ->name('service-models.store');
            Route::put('service-models/{service_model}', [ServiceModelController::class, 'update'])
                ->name('service-models.update');
            Route::delete('service-models/{service_model}', [ServiceModelController::class, 'destroy'])
                ->name('service-models.destroy');

            // Standalone apiResource routes expected by feature tests
            Route::apiResource('api-types', ApiTypeController::class)->names([
                'index' => 'catalog.api-types.index', 'show' => 'catalog.api-types.show',
                'store' => 'catalog.api-types.store', 'update' => 'catalog.api-types.update',
                'destroy' => 'catalog.api-types.destroy',
            ]);
            Route::apiResource('api-categories', ApiCategoryController::class)->names([
                'index' => 'catalog.api-categories.index', 'show' => 'catalog.api-categories.show',
                'store' => 'catalog.api-categories.store', 'update' => 'catalog.api-categories.update',
                'destroy' => 'catalog.api-categories.destroy',
            ]);
            Route::apiResource('component-types', ComponentTypeController::class)->names([
                'index' => 'catalog.component-types.index', 'show' => 'catalog.component-types.show',
                'store' => 'catalog.component-types.store', 'update' => 'catalog.component-types.update',
                'destroy' => 'catalog.component-types.destroy',
            ]);
            Route::apiResource('link-categories', LinkCategoryController::class)->names([
                'index' => 'catalog.link-categories.index', 'show' => 'catalog.link-categories.show',
                'store' => 'catalog.link-categories.store', 'update' => 'catalog.link-categories.update',
                'destroy' => 'catalog.link-categories.destroy',
            ]);
            Route::apiResource('resource-categories', ResourceCategoryController::class)->names([
                'index' => 'catalog.resource-categories.index', 'show' => 'catalog.resource-categories.show',
                'store' => 'catalog.resource-categories.store', 'update' => 'catalog.resource-categories.update',
                'destroy' => 'catalog.resource-categories.destroy',
            ]);
            Route::apiResource('service-statuses', ServiceStatusController::class)->names([
                'index' => 'catalog.service-statuses.index', 'show' => 'catalog.service-statuses.show',
                'store' => 'catalog.service-statuses.store', 'update' => 'catalog.service-statuses.update',
                'destroy' => 'catalog.service-statuses.destroy',
            ]);
            Route::apiResource('vendors', VendorController::class)->names([
                'index' => 'catalog.vendors.index', 'show' => 'catalog.vendors.show',
                'store' => 'catalog.vendors.store', 'update' => 'catalog.vendors.update',
                'destroy' => 'catalog.vendors.destroy',
            ]);
            Route::apiResource('lifecycle-phases', LifecyclePhaseController::class)->parameters(['lifecycle-phases' => 'lifecycle'])->names([
                'index' => 'catalog.lifecycle-phases.index', 'show' => 'catalog.lifecycle-phases.show',
                'store' => 'catalog.lifecycle-phases.store', 'update' => 'catalog.lifecycle-phases.update',
                'destroy' => 'catalog.lifecycle-phases.destroy',
            ]);
        });
    });
});
