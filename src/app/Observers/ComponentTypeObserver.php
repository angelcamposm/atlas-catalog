<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ComponentType;
use Illuminate\Support\Facades\Auth;

class ComponentTypeObserver
{
    /**
     * Handle the ComponentType "created" event.
     */
    public function created(ComponentType $componentType): void
    {
        //
    }

    /**
     * Handle the ComponentType "creating" event.
     */
    public function creating(ComponentType $componentType): void
    {
        if (Auth::check() && is_null($componentType->created_by)) {
            $componentType->created_by = Auth::id();
        }
    }

    /**
     * Handle the ComponentType "updated" event.
     */
    public function updated(ComponentType $componentType): void
    {
        //
    }

    /**
     * Handle the ComponentType "creating" event.
     */
    public function updating(ComponentType $componentType): void
    {
        if (Auth::check() && is_null($componentType->updated_by)) {
            $componentType->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ComponentType "deleted" event.
     */
    public function deleted(ComponentType $componentType): void
    {
        //
    }

    /**
     * Handle the ComponentType "restored" event.
     */
    public function restored(ComponentType $componentType): void
    {
        //
    }

    /**
     * Handle the ComponentType "force deleted" event.
     */
    public function forceDeleted(ComponentType $componentType): void
    {
        //
    }
}
