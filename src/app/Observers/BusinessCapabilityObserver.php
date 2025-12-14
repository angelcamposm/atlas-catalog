<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\BusinessCapability;
use Illuminate\Support\Facades\Auth;

class BusinessCapabilityObserver
{
    /**
     * Handle the BusinessCapability "created" event.
     */
    public function created(BusinessCapability $businessCapability): void
    {
        //
    }

    /**
     * Handle the BusinessCapability "creating" event.
     */
    public function creating(BusinessCapability $businessCapability): void
    {
        if (Auth::check() && is_null($businessCapability->created_by)) {
            $businessCapability->created_by = Auth::id();
        }
    }

    /**
     * Handle the BusinessCapability "updated" event.
     */
    public function updated(BusinessCapability $businessCapability): void
    {
        //
    }

    /**
     * Handle the BusinessCapability "updating" event.
     */
    public function updating(BusinessCapability $businessCapability): void
    {
        if (Auth::check()) {
            $businessCapability->updated_by = Auth::id();
        }
    }

    /**
     * Handle the BusinessCapability "deleted" event.
     */
    public function deleted(BusinessCapability $businessCapability): void
    {
        //
    }

    /**
     * Handle the BusinessCapability "restored" event.
     */
    public function restored(BusinessCapability $businessCapability): void
    {
        //
    }

    /**
     * Handle the BusinessCapability "force deleted" event.
     */
    public function forceDeleted(BusinessCapability $businessCapability): void
    {
        //
    }
}
