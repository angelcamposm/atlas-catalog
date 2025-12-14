<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Resource;
use App\Models\ResourceCategory;
use Illuminate\Support\Facades\Auth;

class ResourceCategoryObserver
{
    /**
     * Handle the ResourceCategory "created" event.
     */
    public function created(ResourceCategory $resourceCategory): void
    {
        //
    }

    /**
     * Handle the ResourceCategory "creating" event.
     */
    public function creating(ResourceCategory $resourceCategory): void
    {
        if (is_null($resourceCategory->model)) {
            $resourceCategory->model = strtolower(class_basename(Resource::class));
        }

        if (Auth::check() && is_null($resourceCategory->created_by)) {
            $resourceCategory->created_by = Auth::id();
        }
    }

    /**
     * Handle the ResourceCategory "updated" event.
     */
    public function updated(ResourceCategory $resourceCategory): void
    {
        //
    }

    /**
     * Handle the ResourceCategory "updating" event.
     */
    public function updating(ResourceCategory $resourceCategory): void
    {
        if (is_null($resourceCategory->model)) {
            $resourceCategory->model = strtolower(class_basename(Resource::class));
        }

        if (Auth::check()) {
            $resourceCategory->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ResourceCategory "deleted" event.
     */
    public function deleted(ResourceCategory $resourceCategory): void
    {
        //
    }

    /**
     * Handle the ResourceCategory "restored" event.
     */
    public function restored(ResourceCategory $resourceCategory): void
    {
        //
    }

    /**
     * Handle the ResourceCategory "force deleted" event.
     */
    public function forceDeleted(ResourceCategory $resourceCategory): void
    {
        //
    }
}
