<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Environment;
use Illuminate\Support\Facades\Auth;

class EnvironmentObserver
{
    /**
     * Handle the Environment "created" event.
     */
    public function created(Environment $environment): void
    {
        //
    }

    /**
     * Handle the Environment "creating" event.
     */
    public function creating(Environment $environment): void
    {
        if (Auth::check() && is_null($environment->created_by)) {
            $environment->created_by = Auth::id();
        }
    }

    /**
     * Handle the Environment "updated" event.
     */
    public function updated(Environment $environment): void
    {
        //
    }

    /**
     * Handle the Environment "updating" event.
     */
    public function updating(Environment $environment): void
    {
        if (Auth::check()) {
            $environment->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Environment "deleted" event.
     */
    public function deleted(Environment $environment): void
    {
        //
    }

    /**
     * Handle the Environment "restored" event.
     */
    public function restored(Environment $environment): void
    {
        //
    }

    /**
     * Handle the Environment "force deleted" event.
     */
    public function forceDeleted(Environment $environment): void
    {
        //
    }
}
