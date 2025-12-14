<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Entity;
use Illuminate\Support\Facades\Auth;

class EntityObserver
{
    /**
     * Handle the Entity "created" event.
     */
    public function created(Entity $entity): void
    {
        //
    }

    /**
     * Handle the Entity "creating" event.
     */
    public function creating(Entity $entity): void
    {
        if (Auth::check() && is_null($entity->created_by)) {
            $entity->created_by = Auth::id();
        }
    }

    /**
     * Handle the Entity "updated" event.
     */
    public function updated(Entity $entity): void
    {
        //
    }

    /**
     * Handle the Entity "updating" event.
     */
    public function updating(Entity $entity): void
    {
        if (Auth::check()) {
            $entity->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Entity "deleted" event.
     */
    public function deleted(Entity $entity): void
    {
        //
    }

    /**
     * Handle the Entity "restored" event.
     */
    public function restored(Entity $entity): void
    {
        //
    }

    /**
     * Handle the Entity "force deleted" event.
     */
    public function forceDeleted(Entity $entity): void
    {
        //
    }
}
