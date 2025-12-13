<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\BusinessDomain;
use Illuminate\Support\Facades\Auth;

class BusinessDomainObserver
{
    /**
     * Handle the BusinessDomain "created" event.
     */
    public function created(BusinessDomain $businessDomain): void
    {
        //
    }

    /**
     * Handle the BusinessDomain "creating" event.
     */
    public function creating(BusinessDomain $businessDomain): void
    {
        if ($businessDomain->hasParent() && is_null($businessDomain->display_name)) {
            $businessDomain->display_name = $businessDomain->parent->name.' / '.$businessDomain->name;
        }

        if (Auth::check() && is_null($businessDomain->created_by)) {
            $businessDomain->created_by = Auth::id();
        }
    }

    /**
     * Handle the BusinessDomain "updated" event.
     */
    public function updated(BusinessDomain $businessDomain): void
    {
        //
    }

    /**
     * Handle the BusinessDomain "updating" event.
     */
    public function updating(BusinessDomain $businessDomain): void
    {
        if (Auth::check()) {
            $businessDomain->updated_by = Auth::id();
        }
    }

    /**
     * Handle the BusinessDomain "deleted" event.
     */
    public function deleted(BusinessDomain $businessDomain): void
    {
        //
    }

    /**
     * Handle the BusinessDomain "restored" event.
     */
    public function restored(BusinessDomain $businessDomain): void
    {
        //
    }

    /**
     * Handle the BusinessDomain "force deleted" event.
     */
    public function forceDeleted(BusinessDomain $businessDomain): void
    {
        //
    }
}
