<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Component;
use Illuminate\Support\Facades\Auth;

class ComponentObserver
{
    /**
     * Handle the Component "created" event.
     */
    public function created(Component $component): void
    {
        //
    }

    /**
     * Handle the Component "creating" event.
     */
    public function creating(Component $component): void
    {
        if (Auth::check() && is_null($component->created_by)) {
            $component->created_by = Auth::id();
        }
    }

    /**
     * Handle the Component "updated" event.
     */
    public function updated(Component $component): void
    {
        //
    }

    /**
     * Handle the Component "creating" event.
     */
    public function updating(Component $component): void
    {
        if (Auth::check() && is_null($component->updated_by)) {
            $component->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Component "deleted" event.
     */
    public function deleted(Component $component): void
    {
        //
    }

    /**
     * Handle the Component "restored" event.
     */
    public function restored(Component $component): void
    {
        //
    }

    /**
     * Handle the Component "force deleted" event.
     */
    public function forceDeleted(Component $component): void
    {
        //
    }
}
