<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\EntityAttribute;
use Illuminate\Support\Facades\Auth;

class EntityAttributeObserver
{
    /**
     * Handle the EntityAttribute "created" event.
     */
    public function created(EntityAttribute $entityProperty): void
    {
        //
    }

    /**
     * Handle the EntityAttribute "creating" event.
     */
    public function creating(EntityAttribute $entityProperty): void
    {
        if (Auth::check() && is_null($entityProperty->created_by)) {
            $entityProperty->created_by = Auth::id();
        }
    }

    /**
     * Handle the EntityAttribute "updated" event.
     */
    public function updated(EntityAttribute $entityProperty): void
    {
        //
    }

    /**
     * Handle the EntityAttribute "updating" event.
     */
    public function updating(EntityAttribute $entityProperty): void
    {
        if (Auth::check()) {
            $entityProperty->updated_by = Auth::id();
        }
    }

    /**
     * Handle the EntityAttribute "deleted" event.
     */
    public function deleted(EntityAttribute $entityProperty): void
    {
        //
    }

    /**
     * Handle the EntityAttribute "restored" event.
     */
    public function restored(EntityAttribute $entityProperty): void
    {
        //
    }

    /**
     * Handle the EntityAttribute "force deleted" event.
     */
    public function forceDeleted(EntityAttribute $entityProperty): void
    {
        //
    }
}
