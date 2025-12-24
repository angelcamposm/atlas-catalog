<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\WorkflowRunCommit;
use Illuminate\Support\Facades\Auth;

class WorkflowRunCommitObserver
{
    /**
     * Handle the WorkflowRunCommit "created" event.
     */
    public function created(WorkflowRunCommit $workflowRunCommit): void
    {
        //
    }

    /**
     * Handle the WorkflowRunCommit "creating" event.
     */
    public function creating(WorkflowRunCommit $workflowRunCommit): void
    {
        if (Auth::check() && is_null($workflowRunCommit->created_by)) {
            $workflowRunCommit->created_by = Auth::id();
        }
    }

    /**
     * Handle the WorkflowRunCommit "updated" event.
     */
    public function updated(WorkflowRunCommit $workflowRunCommit): void
    {
        //
    }

    /**
     * Handle the WorkflowRunCommit "updating" event.
     */
    public function updating(WorkflowRunCommit $workflowRunCommit): void
    {
        if (Auth::check()) {
            $workflowRunCommit->updated_by = Auth::id();
        }
    }

    /**
     * Handle the WorkflowRunCommit "deleted" event.
     */
    public function deleted(WorkflowRunCommit $workflowRunCommit): void
    {
        //
    }

    /**
     * Handle the WorkflowRunCommit "restored" event.
     */
    public function restored(WorkflowRunCommit $workflowRunCommit): void
    {
        //
    }

    /**
     * Handle the WorkflowRunCommit "force deleted" event.
     */
    public function forceDeleted(WorkflowRunCommit $workflowRunCommit): void
    {
        //
    }
}
