<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Cluster;
use Illuminate\Support\Facades\Auth;

class ClusterObserver
{
    /**
     * Handle the Cluster "created" event.
     */
    public function created(Cluster $cluster): void
    {
        //
    }

    /**
     * Handle the Cluster "creating" event.
     */
    public function creating(Cluster $cluster): void
    {
        if (Auth::check() && is_null($cluster->created_by)) {
            $cluster->created_by = Auth::id();
        }
    }

    /**
     * Handle the Cluster "updated" event.
     */
    public function updated(Cluster $cluster): void
    {
        //
    }

    /**
     * Handle the Cluster "updating" event.
     */
    public function updating(Cluster $cluster): void
    {
        if (Auth::check()) {
            $cluster->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Cluster "deleted" event.
     */
    public function deleted(Cluster $cluster): void
    {
        //
    }

    /**
     * Handle the Cluster "restored" event.
     */
    public function restored(Cluster $cluster): void
    {
        //
    }

    /**
     * Handle the Cluster "force deleted" event.
     */
    public function forceDeleted(Cluster $cluster): void
    {
        //
    }
}
