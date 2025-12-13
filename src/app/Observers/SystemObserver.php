<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\System;
use Illuminate\Support\Facades\Auth;

class SystemObserver
{
    /**
     * Handle the System "created" event.
     */
    public function created(System $system): void
    {
        //
    }

    /**
     * Handle the System "creating" event.
     */
    public function creating(System $system): void
    {
        if (Auth::check() && is_null($system->created_by)) {
            $system->created_by = Auth::id();
        }
    }

    /**
     * Handle the System "updated" event.
     */
    public function updated(System $system): void
    {
        //
    }

    /**
     * Handle the System "updating" event.
     */
    public function updating(System $system): void
    {
        if (Auth::check()) {
            $system->updated_by = Auth::id();
        }
    }

    /**
     * Handle the System "deleted" event.
     */
    public function deleted(System $system): void
    {
        //
    }

    /**
     * Handle the System "restored" event.
     */
    public function restored(System $system): void
    {
        //
    }

    /**
     * Handle the System "force deleted" event.
     */
    public function forceDeleted(System $system): void
    {
        //
    }
}
