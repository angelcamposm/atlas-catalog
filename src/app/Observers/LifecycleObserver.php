<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Lifecycle;
use Illuminate\Support\Facades\Auth;

class LifecycleObserver
{
    /**
     * Handle the Lifecycle "created" event.
     */
    public function created(Lifecycle $lifecycle): void
    {
        //
    }

    /**
     * Handle the Lifecycle "creating" event.
     */
    public function creating(Lifecycle $lifecycle): void
    {
        if (Auth::check() && is_null($lifecycle->created_by)) {
            $lifecycle->created_by = Auth::id();
        }
    }

    /**
     * Handle the Lifecycle "updated" event.
     */
    public function updated(Lifecycle $lifecycle): void
    {
        //
    }

    /**
     * Handle the Lifecycle "updating" event.
     */
    public function updating(Lifecycle $lifecycle): void
    {
        if (Auth::check()) {
            $lifecycle->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Lifecycle "deleted" event.
     */
    public function deleted(Lifecycle $lifecycle): void
    {
        //
    }

    /**
     * Handle the Lifecycle "restored" event.
     */
    public function restored(Lifecycle $lifecycle): void
    {
        //
    }

    /**
     * Handle the Lifecycle "force deleted" event.
     */
    public function forceDeleted(Lifecycle $lifecycle): void
    {
        //
    }
}
