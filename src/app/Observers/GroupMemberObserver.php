<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\GroupMember;
use Illuminate\Support\Facades\Auth;

class GroupMemberObserver
{
    /**
     * Handle the GroupMember "created" event.
     */
    public function created(GroupMember $groupMember): void
    {
        //
    }

    /**
     * Handle the GroupMember "creating" event.
     */
    public function creating(GroupMember $groupMember): void
    {
        if (Auth::check() && is_null($groupMember->created_by)) {
            $groupMember->created_by = Auth::id();
        }
    }

    /**
     * Handle the GroupMember "updated" event.
     */
    public function updated(GroupMember $groupMember): void
    {
        //
    }

    /**
     * Handle the GroupMember "creating" event.
     */
    public function updating(GroupMember $groupMember): void
    {
        if (Auth::check() && is_null($groupMember->updated_by)) {
            $groupMember->updated_by = Auth::id();
        }
    }

    /**
     * Handle the GroupMember "deleted" event.
     */
    public function deleted(GroupMember $groupMember): void
    {
        //
    }

    /**
     * Handle the GroupMember "restored" event.
     */
    public function restored(GroupMember $groupMember): void
    {
        //
    }

    /**
     * Handle the GroupMember "force deleted" event.
     */
    public function forceDeleted(GroupMember $groupMember): void
    {
        //
    }
}
