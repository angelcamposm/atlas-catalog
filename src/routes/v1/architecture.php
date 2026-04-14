<?php

declare(strict_types=1);

use App\Http\Controllers\BusinessCapabilityController;
use App\Http\Controllers\BusinessCapabilitySystemController;
use App\Http\Controllers\InfrastructureTypeController;
use App\Http\Controllers\BusinessDomainComponentController;
use App\Http\Controllers\BusinessDomainController;
use App\Http\Controllers\BusinessDomainEntityController;
use App\Http\Controllers\BusinessTierController;
use App\Http\Controllers\EntityComponentController;
use App\Http\Controllers\EntityAttributeController;
use App\Http\Controllers\EntityController;
use App\Http\Controllers\LifecyclePhaseComponentController;
use App\Http\Controllers\LifecyclePhaseController;
use App\Http\Controllers\SystemComponentController;
use App\Http\Controllers\SystemController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    Route::prefix('architecture')->group(function () {
        // Business Capability
        //
        Route::apiResource('business-capabilities', BusinessCapabilityController::class);
        Route::get('business-capabilities/{business_capability}/systems', BusinessCapabilitySystemController::class)
            ->name('business-capabilities.systems');
        Route::apiResource('business-capability-systems', BusinessCapabilitySystemController::class);

        // Business Domain
        //
        Route::apiResource('business-domains', BusinessDomainController::class);
        Route::get('business-domains/{business_domain}/components', BusinessDomainComponentController::class)
            ->name('business-domains.components');
        Route::get('business-domains/{business_domain}/entities', BusinessDomainEntityController::class)
            ->name('business-domains.entities');

        // Business Domain
        //
        Route::apiResource('business-tiers', BusinessTierController::class);

        // Entities
        //
        Route::apiResource('entities', EntityController::class);
        Route::apiResource('entities.attributes', EntityAttributeController::class);
        Route::get('entities/{entity}/components', EntityComponentController::class)->name('entities.components');

        // Lifecycles
        //
        Route::apiResource('lifecycles', LifecyclePhaseController::class);
        Route::get('lifecycles/{lifecycle}/components', LifecyclePhaseComponentController::class)
            ->name('lifecycles.components');

        // Systems
        //
        Route::apiResource('systems', SystemController::class);
        Route::get('systems/{system}/components', SystemComponentController::class)->name('systems.components');

        // Infrastructure Types (also accessible under architecture prefix)
        //
        Route::apiResource('infrastructure-types', InfrastructureTypeController::class)->names([
            'index'   => 'architecture.infrastructure-types.index',
            'show'    => 'architecture.infrastructure-types.show',
            'store'   => 'architecture.infrastructure-types.store',
            'update'  => 'architecture.infrastructure-types.update',
            'destroy' => 'architecture.infrastructure-types.destroy',
        ]);
    });
});
