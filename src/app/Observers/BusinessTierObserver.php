<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\BusinessTier;
use Illuminate\Support\Facades\Auth;

class BusinessTierObserver
{
    /**
     * Handle the BusinessTier "created" event.
     */
    public function created(BusinessTier $businessTier): void
    {
        //
    }

    /**
     * Handle the BusinessTier "creating" event.
     */
    public function creating(BusinessTier $businessTier): void
    {
        if (Auth::check() && is_null($businessTier->created_by)) {
            $businessTier->created_by = Auth::id();
        }
    }

    /**
     * Handle the BusinessTier "updated" event.
     */
    public function updated(BusinessTier $businessTier): void
    {
        //
    }

    /**
     * Handle the BusinessTier "updating" event.
     */
    public function updating(BusinessTier $businessTier): void
    {
        if (Auth::check()) {
            $businessTier->updated_by = Auth::id();
        }
    }

    /**
     * Handle the BusinessTier "deleted" event.
     */
    public function deleted(BusinessTier $businessTier): void
    {
        //
    }

    /**
     * Handle the BusinessTier "restored" event.
     */
    public function restored(BusinessTier $businessTier): void
    {
        //
    }

    /**
     * Handle the BusinessTier "force deleted" event.
     */
    public function forceDeleted(BusinessTier $businessTier): void
    {
        //
    }
}
