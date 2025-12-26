<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ServiceModel;
use Illuminate\Support\Facades\Auth;

class ServiceModelObserver
{
    /**
     * Handle the ServiceModel "created" event.
     */
    public function created(ServiceModel $serviceModel): void
    {
        //
    }

    /**
     * Handle the ServiceModel "creating" event.
     */
    public function creating(ServiceModel $serviceModel): void
    {
        if (Auth::check() && is_null($serviceModel->created_by)) {
            $serviceModel->created_by = Auth::id();
        }
    }

    /**
     * Handle the ServiceModel "updated" event.
     */
    public function updated(ServiceModel $serviceModel): void
    {
        //
    }

    /**
     * Handle the ServiceModel "updating" event.
     */
    public function updating(ServiceModel $serviceModel): void
    {
        if (Auth::check()) {
            $serviceModel->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ServiceModel "deleted" event.
     */
    public function deleted(ServiceModel $serviceModel): void
    {
        //
    }

    /**
     * Handle the ServiceModel "restored" event.
     */
    public function restored(ServiceModel $serviceModel): void
    {
        //
    }

    /**
     * Handle the ServiceModel "force deleted" event.
     */
    public function forceDeleted(ServiceModel $serviceModel): void
    {
        //
    }
}
