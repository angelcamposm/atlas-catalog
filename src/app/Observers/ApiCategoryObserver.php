<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ApiCategory;
use Illuminate\Support\Facades\Auth;

class ApiCategoryObserver
{
    /**
     * Handle the ApiCategory "created" event.
     */
    public function created(ApiCategory $apiCategory): void
    {
        //
    }

    /**
     * Handle the ApiCategory "creating" event.
     */
    public function creating(ApiCategory $apiCategory): void
    {
        if (Auth::check() && is_null($apiCategory->created_by)) {
            $apiCategory->created_by = Auth::id();
        }
    }

    /**
     * Handle the ApiCategory "updated" event.
     */
    public function updated(ApiCategory $apiCategory): void
    {
        //
    }

    /**
     * Handle the ApiCategory "creating" event.
     */
    public function updating(ApiCategory $apiCategory): void
    {
        if (Auth::check() && is_null($apiCategory->updated_by)) {
            $apiCategory->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ApiCategory "deleted" event.
     */
    public function deleted(ApiCategory $apiCategory): void
    {
        //
    }

    /**
     * Handle the ApiCategory "restored" event.
     */
    public function restored(ApiCategory $apiCategory): void
    {
        //
    }

    /**
     * Handle the ApiCategory "force deleted" event.
     */
    public function forceDeleted(ApiCategory $apiCategory): void
    {
        //
    }
}
