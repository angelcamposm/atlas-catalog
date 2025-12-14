<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Platform;
use Illuminate\Support\Facades\Auth;

class PlatformObserver
{
    /**
     * Handle the Platform "created" event.
     */
    public function created(Platform $platform): void
    {
        //
    }

    /**
     * Handle the Platform "creating" event.
     */
    public function creating(Platform $platform): void
    {
        if (Auth::check() && is_null($platform->created_by)) {
            $platform->created_by = Auth::id();
        }
    }

    /**
     * Handle the Platform "updated" event.
     */
    public function updated(Platform $platform): void
    {
        //
    }

    /**
     * Handle the Platform "updating" event.
     */
    public function updating(Platform $platform): void
    {
        if (Auth::check()) {
            $platform->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Platform "deleted" event.
     */
    public function deleted(Platform $platform): void
    {
        //
    }

    /**
     * Handle the Platform "restored" event.
     */
    public function restored(Platform $platform): void
    {
        //
    }

    /**
     * Handle the Platform "force deleted" event.
     */
    public function forceDeleted(Platform $platform): void
    {
        //
    }
}
