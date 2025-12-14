<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\GroupType;
use Illuminate\Support\Facades\Auth;

class GroupTypeObserver
{
    /**
     * Handle the GroupType "created" event.
     */
    public function created(GroupType $groupType): void
    {
        //
    }

    /**
     * Handle the GroupType "creating" event.
     */
    public function creating(GroupType $groupType): void
    {
        if (Auth::check() && is_null($groupType->created_by)) {
            $groupType->created_by = Auth::id();
        }
    }

    /**
     * Handle the GroupType "updated" event.
     */
    public function updated(GroupType $groupType): void
    {
        //
    }

    /**
     * Handle the GroupType "updating" event.
     */
    public function updating(GroupType $groupType): void
    {
        if (Auth::check()) {
            $groupType->updated_by = Auth::id();
        }
    }

    /**
     * Handle the GroupType "deleted" event.
     */
    public function deleted(GroupType $groupType): void
    {
        //
    }

    /**
     * Handle the GroupType "restored" event.
     */
    public function restored(GroupType $groupType): void
    {
        //
    }

    /**
     * Handle the GroupType "force deleted" event.
     */
    public function forceDeleted(GroupType $groupType): void
    {
        //
    }
}
