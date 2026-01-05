<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Deployment;
use Illuminate\Support\Facades\Auth;

class DeploymentObserver
{
    public function creating(Deployment $deployment): void
    {
        if (Auth::check()) {
            $deployment->created_by = Auth::id();
            $deployment->updated_by = Auth::id();
        }
    }

    public function updating(Deployment $deployment): void
    {
        if (Auth::check()) {
            $deployment->updated_by = Auth::id();
        }
    }
}
