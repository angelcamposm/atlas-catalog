<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\LifecyclePhase;
use Illuminate\Support\Facades\Auth;

class LifecyclePhaseObserver
{
    /**
     * Handle the LifecyclePhase "created" event.
     */
    public function created(LifecyclePhase $lifecycle): void
    {
        //
    }

    /**
     * Handle the LifecyclePhase "creating" event.
     */
    public function creating(LifecyclePhase $lifecycle): void
    {
        if (Auth::check() && is_null($lifecycle->created_by)) {
            $lifecycle->created_by = Auth::id();
        }
    }

    /**
     * Handle the LifecyclePhase "updated" event.
     */
    public function updated(LifecyclePhase $lifecycle): void
    {
        //
    }

    /**
     * Handle the LifecyclePhase "updating" event.
     */
    public function updating(LifecyclePhase $lifecycle): void
    {
        if (Auth::check()) {
            $lifecycle->updated_by = Auth::id();
        }
    }

    /**
     * Handle the LifecyclePhase "deleted" event.
     */
    public function deleted(LifecyclePhase $lifecycle): void
    {
        //
    }

    /**
     * Handle the LifecyclePhase "restored" event.
     */
    public function restored(LifecyclePhase $lifecycle): void
    {
        //
    }

    /**
     * Handle the LifecyclePhase "force deleted" event.
     */
    public function forceDeleted(LifecyclePhase $lifecycle): void
    {
        //
    }
}
