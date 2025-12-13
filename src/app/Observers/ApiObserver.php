<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Api;
use Illuminate\Support\Facades\Auth;

class ApiObserver
{
    /**
     * Handle the Api "created" event.
     */
    public function created(Api $api): void
    {
        //
    }

    /**
     * Handle the Api "creating" event.
     */
    public function creating(Api $api): void
    {
        if (Auth::check() && is_null($api->created_by)) {
            $api->created_by = Auth::id();
        }
    }

    /**
     * Handle the Api "updated" event.
     */
    public function updated(Api $api): void
    {
        //
    }

    /**
     * Handle the Api "updating" event.
     */
    public function updating(Api $api): void
    {
        if (Auth::check()) {
            $api->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Api "deleted" event.
     */
    public function deleted(Api $api): void
    {
        //
    }

    /**
     * Handle the Api "restored" event.
     */
    public function restored(Api $api): void
    {
        //
    }

    /**
     * Handle the Api "force deleted" event.
     */
    public function forceDeleted(Api $api): void
    {
        //
    }
}
