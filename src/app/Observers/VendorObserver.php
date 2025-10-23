<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Vendor;
use Illuminate\Support\Facades\Auth;

class VendorObserver
{
    /**
     * Handle the Vendor "created" event.
     */
    public function created(Vendor $vendor): void
    {
        //
    }

    /**
     * Handle the Vendor "creating" event.
     */
    public function creating(Vendor $vendor): void
    {
        if (Auth::check() && is_null($vendor->created_by)) {
            $vendor->created_by = Auth::id();
        }
    }

    /**
     * Handle the Vendor "updated" event.
     */
    public function updated(Vendor $vendor): void
    {
        //
    }

    /**
     * Handle the Vendor "creating" event.
     */
    public function updating(Vendor $vendor): void
    {
        if (Auth::check() && is_null($vendor->updated_by)) {
            $vendor->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Vendor "deleted" event.
     */
    public function deleted(Vendor $vendor): void
    {
        //
    }

    /**
     * Handle the Vendor "restored" event.
     */
    public function restored(Vendor $vendor): void
    {
        //
    }

    /**
     * Handle the Vendor "force deleted" event.
     */
    public function forceDeleted(Vendor $vendor): void
    {
        //
    }
}
