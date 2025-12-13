<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ClusterType;
use Illuminate\Support\Facades\Auth;

class ClusterTypeObserver
{
    /**
     * Handle the ClusterType "created" event.
     */
    public function created(ClusterType $clusterType): void
    {
        //
    }

    /**
     * Handle the ClusterType "creating" event.
     */
    public function creating(ClusterType $clusterType): void
    {
        if (Auth::check() && is_null($clusterType->created_by)) {
            $clusterType->created_by = Auth::id();
        }
    }

    /**
     * Handle the ClusterType "updated" event.
     */
    public function updated(ClusterType $clusterType): void
    {
        //
    }

    /**
     * Handle the ClusterType "updating" event.
     */
    public function updating(ClusterType $clusterType): void
    {
        if (Auth::check()) {
            $clusterType->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ClusterType "deleted" event.
     */
    public function deleted(ClusterType $clusterType): void
    {
        //
    }

    /**
     * Handle the ClusterType "restored" event.
     */
    public function restored(ClusterType $clusterType): void
    {
        //
    }

    /**
     * Handle the ClusterType "force deleted" event.
     */
    public function forceDeleted(ClusterType $clusterType): void
    {
        //
    }
}
