<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ServiceAccount;
use Illuminate\Support\Facades\Auth;

class ServiceAccountObserver
{
    /**
     * Handle the ServiceAccount "created" event.
     */
    public function created(ServiceAccount $serviceAccount): void
    {
        //
    }

    /**
     * Handle the ServiceAccount "creating" event.
     */
    public function creating(ServiceAccount $serviceAccount): void
    {
        if (Auth::check() && is_null($serviceAccount->created_by)) {
            $serviceAccount->created_by = Auth::id();
        }
    }

    /**
     * Handle the ServiceAccount "updated" event.
     */
    public function updated(ServiceAccount $serviceAccount): void
    {
        //
    }

    /**
     * Handle the ServiceAccount "updating" event.
     */
    public function updating(ServiceAccount $serviceAccount): void
    {
        if (Auth::check()) {
            $serviceAccount->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ServiceAccount "deleted" event.
     */
    public function deleted(ServiceAccount $serviceAccount): void
    {
        //
    }

    /**
     * Handle the ServiceAccount "restored" event.
     */
    public function restored(ServiceAccount $serviceAccount): void
    {
        //
    }

    /**
     * Handle the ServiceAccount "force deleted" event.
     */
    public function forceDeleted(ServiceAccount $serviceAccount): void
    {
        //
    }
}
