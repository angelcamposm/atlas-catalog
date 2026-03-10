<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\BusinessCapabilitySystem;
use Illuminate\Support\Facades\Auth;

class BusinessCapabilitySystemObserver
{
    public function creating(BusinessCapabilitySystem $model): void
    {
        if (Auth::check() && is_null($model->created_by)) {
            $model->created_by = Auth::id();
        }
    }

    public function updating(BusinessCapabilitySystem $model): void
    {
        if (Auth::check()) {
            $model->updated_by = Auth::id();
        }
    }
}
