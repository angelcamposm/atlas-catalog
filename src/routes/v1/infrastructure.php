<?php

declare(strict_types=1);

use App\Http\Controllers\ClusterController;
use App\Http\Controllers\ClusterNodeController;
use App\Http\Controllers\ClusterServiceAccountController;
use App\Http\Controllers\ClusterTypeController;
use App\Http\Controllers\InfrastructureTypeController;
use App\Http\Controllers\NodeController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('infrastructure')->group(function () {

        // Clusters
        //
        Route::apiResource('clusters', ClusterController::class);
        Route::get('clusters/{cluster}/nodes', ClusterNodeController::class)
            ->name('clusters.nodes')
            ->whereNumber('cluster');
        Route::get('clusters/{cluster}/service-accounts', ClusterServiceAccountController::class)
            ->name('clusters.service-accounts')
            ->whereNumber('cluster');
        Route::apiResource('clusters/types', ClusterTypeController::class);

        Route::apiResource('nodes', NodeController::class);

        Route::apiResource('types', InfrastructureTypeController::class);

        Route::apiResource('vendors', VendorController::class);
    });
});
