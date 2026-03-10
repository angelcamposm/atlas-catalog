<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ComplianceRequirement;
use Illuminate\Support\Facades\Auth;

class ComplianceRequirementObserver
{
    public function creating(ComplianceRequirement $model): void
    {
        if (Auth::check() && is_null($model->created_by)) {
            $model->created_by = Auth::id();
        }
    }

    public function updating(ComplianceRequirement $model): void
    {
        if (Auth::check()) {
            $model->updated_by = Auth::id();
        }
    }
}
