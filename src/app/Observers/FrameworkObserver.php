<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Framework;
use Illuminate\Support\Facades\Auth;

class FrameworkObserver
{
    /**
     * Handle the Framework "created" event.
     */
    public function created(Framework $framework): void
    {
        //
    }

    /**
     * Handle the Framework "creating" event.
     */
    public function creating(Framework $framework): void
    {
        if (Auth::check() && is_null($framework->created_by)) {
            $framework->created_by = Auth::id();
        }
    }

    /**
     * Handle the Framework "updated" event.
     */
    public function updated(Framework $framework): void
    {
        //
    }

    /**
     * Handle the Framework "creating" event.
     */
    public function updating(Framework $framework): void
    {
        if (Auth::check() && is_null($framework->updated_by)) {
            $framework->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Framework "deleted" event.
     */
    public function deleted(Framework $framework): void
    {
        //
    }

    /**
     * Handle the Framework "restored" event.
     */
    public function restored(Framework $framework): void
    {
        //
    }

    /**
     * Handle the Framework "force deleted" event.
     */
    public function forceDeleted(Framework $framework): void
    {
        //
    }
}
