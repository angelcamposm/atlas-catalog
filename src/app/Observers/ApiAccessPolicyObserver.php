<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ApiAccessPolicy;
use Illuminate\Support\Facades\Auth;

class ApiAccessPolicyObserver
{
    /**
     * Handle the ApiAccessPolicy "created" event.
     */
    public function created(ApiAccessPolicy $apiAccessPolicy): void
    {
        //
    }

    /**
     * Handle the ApiAccessPolicy "creating" event.
     */
    public function creating(ApiAccessPolicy $apiAccessPolicy): void
    {
        if (Auth::check() && is_null($apiAccessPolicy->created_by)) {
            $apiAccessPolicy->created_by = Auth::id();
        }
    }

    /**
     * Handle the ApiAccessPolicy "updated" event.
     */
    public function updated(ApiAccessPolicy $apiAccessPolicy): void
    {
        //
    }

    /**
     * Handle the ApiAccessPolicy "updating" event.
     */
    public function updating(ApiAccessPolicy $apiAccessPolicy): void
    {
        if (Auth::check()) {
            $apiAccessPolicy->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ApiAccessPolicy "deleted" event.
     */
    public function deleted(ApiAccessPolicy $apiAccessPolicy): void
    {
        //
    }

    /**
     * Handle the ApiAccessPolicy "restored" event.
     */
    public function restored(ApiAccessPolicy $apiAccessPolicy): void
    {
        //
    }

    /**
     * Handle the ApiAccessPolicy "force deleted" event.
     */
    public function forceDeleted(ApiAccessPolicy $apiAccessPolicy): void
    {
        //
    }
}
