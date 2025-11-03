<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\InfrastructureType;
use Illuminate\Support\Facades\Auth;

class InfrastructureTypeObserver
{
    /**
     * Handle the InfrastructureType "created" event.
     */
    public function created(InfrastructureType $infrastructureType): void
    {
        //
    }

    /**
     * Handle the InfrastructureType "creating" event.
     */
    public function creating(InfrastructureType $infrastructureType): void
    {
        if (Auth::check() && is_null($infrastructureType->created_by)) {
            $infrastructureType->created_by = Auth::id();
        }
    }

    /**
     * Handle the InfrastructureType "updated" event.
     */
    public function updated(InfrastructureType $infrastructureType): void
    {
        //
    }

    /**
     * Handle the InfrastructureType "creating" event.
     */
    public function updating(InfrastructureType $infrastructureType): void
    {
        if (Auth::check() && is_null($infrastructureType->updated_by)) {
            $infrastructureType->updated_by = Auth::id();
        }
    }

    /**
     * Handle the InfrastructureType "deleted" event.
     */
    public function deleted(InfrastructureType $infrastructureType): void
    {
        //
    }

    /**
     * Handle the InfrastructureType "restored" event.
     */
    public function restored(InfrastructureType $infrastructureType): void
    {
        //
    }

    /**
     * Handle the InfrastructureType "force deleted" event.
     */
    public function forceDeleted(InfrastructureType $infrastructureType): void
    {
        //
    }
}
