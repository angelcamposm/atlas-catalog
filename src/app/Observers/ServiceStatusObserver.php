<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ServiceStatus;
use Illuminate\Support\Facades\Auth;

class ServiceStatusObserver
{
    /**
     * Handle the ServiceStatus "created" event.
     */
    public function created(ServiceStatus $serviceStatus): void
    {
        //
    }

    /**
     * Handle the ServiceStatus "creating" event.
     */
    public function creating(ServiceStatus $serviceStatus): void
    {
        if (Auth::check() && is_null($serviceStatus->created_by)) {
            $serviceStatus->created_by = Auth::id();
        }
    }

    /**
     * Handle the ServiceStatus "updated" event.
     */
    public function updated(ServiceStatus $serviceStatus): void
    {
        //
    }

    /**
     * Handle the ServiceStatus "creating" event.
     */
    public function updating(ServiceStatus $serviceStatus): void
    {
        if (Auth::check() && is_null($serviceStatus->updated_by)) {
            $serviceStatus->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ServiceStatus "deleted" event.
     */
    public function deleted(ServiceStatus $serviceStatus): void
    {
        //
    }

    /**
     * Handle the ServiceStatus "restored" event.
     */
    public function restored(ServiceStatus $serviceStatus): void
    {
        //
    }

    /**
     * Handle the ServiceStatus "force deleted" event.
     */
    public function forceDeleted(ServiceStatus $serviceStatus): void
    {
        //
    }
}
