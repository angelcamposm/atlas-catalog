<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Resource;
use Illuminate\Support\Facades\Auth;

class ResourceObserver
{
    /**
     * Handle the Resource "created" event.
     */
    public function created(Resource $resource): void
    {
        //
    }

    /**
     * Handle the Resource "creating" event.
     */
    public function creating(Resource $resource): void
    {
        if (Auth::check() && is_null($resource->created_by)) {
            $resource->created_by = Auth::id();
        }
    }

    /**
     * Handle the Resource "updated" event.
     */
    public function updated(Resource $resource): void
    {
        //
    }

    /**
     * Handle the Resource "updating" event.
     */
    public function updating(Resource $resource): void
    {
        if (Auth::check()) {
            $resource->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Resource "deleted" event.
     */
    public function deleted(Resource $resource): void
    {
        //
    }

    /**
     * Handle the Resource "restored" event.
     */
    public function restored(Resource $resource): void
    {
        //
    }

    /**
     * Handle the Resource "force deleted" event.
     */
    public function forceDeleted(Resource $resource): void
    {
        //
    }
}
