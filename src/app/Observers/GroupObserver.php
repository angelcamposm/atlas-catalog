<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Group;
use Illuminate\Support\Facades\Auth;

class GroupObserver
{
    /**
     * Handle the Group "created" event.
     */
    public function created(Group $group): void
    {
        //
    }

    /**
     * Handle the Group "creating" event.
     */
    public function creating(Group $group): void
    {
        if (Auth::check() && is_null($group->created_by)) {
            $group->created_by = Auth::id();
        }
    }

    /**
     * Handle the Group "updated" event.
     */
    public function updated(Group $group): void
    {
        //
    }

    /**
     * Handle the Group "updating" event.
     */
    public function updating(Group $group): void
    {
        if (Auth::check()) {
            $group->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Group "deleted" event.
     */
    public function deleted(Group $group): void
    {
        //
    }

    /**
     * Handle the Group "restored" event.
     */
    public function restored(Group $group): void
    {
        //
    }

    /**
     * Handle the Group "force deleted" event.
     */
    public function forceDeleted(Group $group): void
    {
        //
    }
}
