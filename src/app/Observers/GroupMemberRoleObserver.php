<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\GroupMemberRole;
use Illuminate\Support\Facades\Auth;

class GroupMemberRoleObserver
{
    /**
     * Handle the GroupMemberRole "created" event.
     */
    public function created(GroupMemberRole $groupMemberRole): void
    {
        //
    }

    /**
     * Handle the GroupMemberRole "creating" event.
     */
    public function creating(GroupMemberRole $groupMemberRole): void
    {
        if (Auth::check() && is_null($groupMemberRole->created_by)) {
            $groupMemberRole->created_by = Auth::id();
        }
    }

    /**
     * Handle the GroupMemberRole "updated" event.
     */
    public function updated(GroupMemberRole $groupMemberRole): void
    {
        //
    }

    /**
     * Handle the GroupMemberRole "creating" event.
     */
    public function updating(GroupMemberRole $groupMemberRole): void
    {
        if (Auth::check() && is_null($groupMemberRole->updated_by)) {
            $groupMemberRole->updated_by = Auth::id();
        }
    }

    /**
     * Handle the GroupMemberRole "deleted" event.
     */
    public function deleted(GroupMemberRole $groupMemberRole): void
    {
        //
    }

    /**
     * Handle the GroupMemberRole "restored" event.
     */
    public function restored(GroupMemberRole $groupMemberRole): void
    {
        //
    }

    /**
     * Handle the GroupMemberRole "force deleted" event.
     */
    public function forceDeleted(GroupMemberRole $groupMemberRole): void
    {
        //
    }
}
