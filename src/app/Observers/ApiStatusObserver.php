<?php

namespace App\Observers;

use App\Models\ApiStatus;
use Illuminate\Support\Facades\Auth;

class ApiStatusObserver
{
    /**
     * Handle the ApiStatus "created" event.
     */
    public function created(ApiStatus $apiStatus): void
    {
        //
    }

    /**
     * Handle the ApiAccessPolicy "creating" event.
     */
    public function creating(ApiStatus $apiStatus): void
    {
        if (Auth::check() && is_null($apiStatus->created_by)) {
            $apiStatus->created_by = Auth::id();
        }
    }

    /**
     * Handle the ApiStatus "updated" event.
     */
    public function updated(ApiStatus $apiStatus): void
    {
        //
    }

    /**
     * Handle the ApiAccessPolicy "updating" event.
     */
    public function updating(ApiStatus $apiStatus): void
    {
        if (Auth::check()) {
            $apiStatus->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ApiStatus "deleted" event.
     */
    public function deleted(ApiStatus $apiStatus): void
    {
        //
    }

    /**
     * Handle the ApiStatus "restored" event.
     */
    public function restored(ApiStatus $apiStatus): void
    {
        //
    }

    /**
     * Handle the ApiStatus "force deleted" event.
     */
    public function forceDeleted(ApiStatus $apiStatus): void
    {
        //
    }
}
