<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Organization;
use Illuminate\Support\Facades\Auth;

class OrganizationObserver
{
    public function creating(Organization $organization): void
    {
        if (Auth::check() && is_null($organization->created_by)) {
            $organization->created_by = Auth::id();
        }
    }

    public function updating(Organization $organization): void
    {
        if (Auth::check()) {
            $organization->updated_by = Auth::id();
        }
    }
}
