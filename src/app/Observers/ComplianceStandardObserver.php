<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ComplianceStandard;
use Illuminate\Support\Facades\Auth;

class ComplianceStandardObserver
{
    /**
     * Handle the ComplianceStandard "created" event.
     */
    public function created(ComplianceStandard $complianceStandard): void
    {
        //
    }

    /**
     * Handle the ComplianceStandard "creating" event.
     */
    public function creating(ComplianceStandard $complianceStandard): void
    {
        if (Auth::check() && is_null($complianceStandard->created_by)) {
            $complianceStandard->created_by = Auth::id();
        }
    }

    /**
     * Handle the ComplianceStandard "updated" event.
     */
    public function updated(ComplianceStandard $complianceStandard): void
    {
        //
    }

    /**
     * Handle the ComplianceStandard "creating" event.
     */
    public function updating(ComplianceStandard $complianceStandard): void
    {
        if (Auth::check() && is_null($complianceStandard->updated_by)) {
            $complianceStandard->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ComplianceStandard "deleted" event.
     */
    public function deleted(ComplianceStandard $complianceStandard): void
    {
        //
    }

    /**
     * Handle the ComplianceStandard "restored" event.
     */
    public function restored(ComplianceStandard $complianceStandard): void
    {
        //
    }

    /**
     * Handle the ComplianceStandard "force deleted" event.
     */
    public function forceDeleted(ComplianceStandard $complianceStandard): void
    {
        //
    }
}
