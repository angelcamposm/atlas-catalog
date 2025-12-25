<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ServiceModel;
use Illuminate\Support\Facades\Auth;

class ServiceModelObserver
{
    /**
     * Handle the ServiceModel "creating" event.
     */
    public function creating(ServiceModel $serviceModel): void
    {
        if (Auth::check()) {
            $serviceModel->created_by = Auth::id();
            $serviceModel->updated_by = Auth::id();
        }
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
}
