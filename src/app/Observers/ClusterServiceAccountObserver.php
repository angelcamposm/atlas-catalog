<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ClusterServiceAccount;
use Illuminate\Support\Facades\Auth;

class ClusterServiceAccountObserver
{
    /**
     * Handle the ClusterServiceAccount "created" event.
     */
    public function created(ClusterServiceAccount $clusterServiceAccount): void
    {
        //
    }

    /**
     * Handle the ClusterServiceAccount "creating" event.
     */
    public function creating(ClusterServiceAccount $clusterServiceAccount): void
    {
        if (Auth::check() && is_null($clusterServiceAccount->created_by)) {
            $clusterServiceAccount->created_by = Auth::id();
        }
    }

    /**
     * Handle the ClusterServiceAccount "updated" event.
     */
    public function updated(ClusterServiceAccount $clusterServiceAccount): void
    {
        //
    }

    /**
     * Handle the ClusterServiceAccount "updating" event.
     */
    public function updating(ClusterServiceAccount $clusterServiceAccount): void
    {
        if (Auth::check()) {
            $clusterServiceAccount->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ClusterServiceAccount "deleted" event.
     */
    public function deleted(ClusterServiceAccount $clusterServiceAccount): void
    {
        //
    }

    /**
     * Handle the ClusterServiceAccount "restored" event.
     */
    public function restored(ClusterServiceAccount $clusterServiceAccount): void
    {
        //
    }

    /**
     * Handle the ClusterServiceAccount "force deleted" event.
     */
    public function forceDeleted(ClusterServiceAccount $clusterServiceAccount): void
    {
        //
    }
}
