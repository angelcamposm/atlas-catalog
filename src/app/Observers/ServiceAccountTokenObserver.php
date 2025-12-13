<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ServiceAccountToken;
use Illuminate\Support\Facades\Auth;

class ServiceAccountTokenObserver
{
    /**
     * Handle the ServiceAccountToken "created" event.
     */
    public function created(ServiceAccountToken $serviceAccountToken): void
    {
        //
    }

    /**
     * Handle the ServiceAccountToken "creating" event.
     */
    public function creating(ServiceAccountToken $serviceAccountToken): void
    {
        if (Auth::check() && is_null($serviceAccountToken->created_by)) {
            $serviceAccountToken->created_by = Auth::id();
        }
    }

    /**
     * Handle the ServiceAccountToken "updated" event.
     */
    public function updated(ServiceAccountToken $serviceAccountToken): void
    {
        //
    }

    /**
     * Handle the ServiceAccountToken "updating" event.
     */
    public function updating(ServiceAccountToken $serviceAccountToken): void
    {
        if (Auth::check()) {
            $serviceAccountToken->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ServiceAccountToken "deleted" event.
     */
    public function deleted(ServiceAccountToken $serviceAccountToken): void
    {
        //
    }

    /**
     * Handle the ServiceAccountToken "restored" event.
     */
    public function restored(ServiceAccountToken $serviceAccountToken): void
    {
        //
    }

    /**
     * Handle the ServiceAccountToken "force deleted" event.
     */
    public function forceDeleted(ServiceAccountToken $serviceAccountToken): void
    {
        //
    }
}
