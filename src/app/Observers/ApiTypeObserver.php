<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ApiType;
use Illuminate\Support\Facades\Auth;

class ApiTypeObserver
{
    /**
     * Handle the ApiType "created" event.
     */
    public function created(ApiType $apiType): void
    {
        //
    }

    /**
     * Handle the ApiType "creating" event.
     */
    public function creating(ApiType $apiType): void
    {
        if (Auth::check() && is_null($apiType->created_by)) {
            $apiType->created_by = Auth::id();
        }
    }

    /**
     * Handle the ApiType "updated" event.
     */
    public function updated(ApiType $apiType): void
    {
        //
    }

    /**
     * Handle the ApiType "updating" event.
     */
    public function updating(ApiType $apiType): void
    {
        if (Auth::check()) {
            $apiType->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ApiType "deleted" event.
     */
    public function deleted(ApiType $apiType): void
    {
        //
    }

    /**
     * Handle the ApiType "restored" event.
     */
    public function restored(ApiType $apiType): void
    {
        //
    }

    /**
     * Handle the ApiType "force deleted" event.
     */
    public function forceDeleted(ApiType $apiType): void
    {
        //
    }
}
