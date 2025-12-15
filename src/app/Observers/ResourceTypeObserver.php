<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ResourceType;
use Illuminate\Support\Facades\Auth;

class ResourceTypeObserver
{
    /**
     * Handle the ResourceType "created" event.
     */
    public function created(ResourceType $resourceType): void
    {
        //
    }

    /**
     * Handle the ResourceType "creating" event.
     */
    public function creating(ResourceType $resourceType): void
    {
        if (Auth::check() && is_null($resourceType->created_by)) {
            $resourceType->created_by = Auth::id();
        }
    }

    /**
     * Handle the ResourceType "updated" event.
     */
    public function updated(ResourceType $resourceType): void
    {
        //
    }

    /**
     * Handle the ResourceType "updating" event.
     */
    public function updating(ResourceType $resourceType): void
    {
        if (Auth::check()) {
            $resourceType->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ResourceType "deleted" event.
     */
    public function deleted(ResourceType $resourceType): void
    {
        //
    }

    /**
     * Handle the ResourceType "restored" event.
     */
    public function restored(ResourceType $resourceType): void
    {
        //
    }

    /**
     * Handle the ResourceType "force deleted" event.
     */
    public function forceDeleted(ResourceType $resourceType): void
    {
        //
    }
}
