<?php

declare(strict_types=1);

use App\Http\Controllers\BusinessCapabilityController;
use App\Http\Controllers\BusinessCapabilitySystemController;
use App\Http\Controllers\BusinessDomainComponentController;
use App\Http\Controllers\BusinessDomainController;
use App\Http\Controllers\BusinessDomainEntityController;
use App\Http\Controllers\BusinessTierController;
use App\Http\Controllers\EntityAttributeController;
use App\Http\Controllers\EntityController;
use App\Http\Controllers\LifecyclePhaseComponentController;
use App\Http\Controllers\LifecyclePhaseController;
use App\Http\Controllers\SystemComponentController;
use App\Http\Controllers\SystemController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('architecture')->group(function () {
        // Business Capability
        //
        Route::apiResource('business-capabilities', BusinessCapabilityController::class);
        Route::get('business-capabilities/{business_capability}/systems', BusinessCapabilitySystemController::class)
            ->name('business-capabilities.systems');

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
        //TODO: Add controller
        Route::get('entities/{entity}/components')->name('entities.components');

        // Lifecycles
        //
        Route::apiResource('lifecycles', LifecyclePhaseController::class);
        Route::get('lifecycles/{lifecycle}/components', LifecyclePhaseComponentController::class)
            ->name('lifecycles.components');

        // Systems
        //
        Route::apiResource('systems', SystemController::class);
        Route::get('systems/{system}/components', SystemComponentController::class)->name('systems.components');
    });
});
