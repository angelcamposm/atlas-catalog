<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Release;
use Illuminate\Support\Facades\Auth;

class ReleaseObserver
{
    /**
     * Handle the Release "created" event.
     */
    public function created(Release $release): void
    {
        //
    }

    /**
     * Handle the Release "creating" event.
     */
    public function creating(Release $release): void
    {
        if (Auth::check() && is_null($release->created_by)) {
            $release->created_by = Auth::id();
        }
    }

    /**
     * Handle the Release "updated" event.
     */
    public function updated(Release $release): void
    {
        //
    }

    /**
     * Handle the Release "updating" event.
     */
    public function updating(Release $release): void
    {
        if (Auth::check()) {
            $release->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Release "deleted" event.
     */
    public function deleted(Release $release): void
    {
        //
    }

    /**
     * Handle the Release "restored" event.
     */
    public function restored(Release $release): void
    {
        //
    }

    /**
     * Handle the Release "force deleted" event.
     */
    public function forceDeleted(Release $release): void
    {
        //
    }
}
