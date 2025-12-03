<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\WorkflowRun;
use Illuminate\Support\Facades\Auth;

class WorkflowRunObserver
{
    /**
     * Handle the WorkflowRun "created" event.
     */
    public function created(WorkflowRun $workflowRun): void
    {
        //
    }

    /**
     * Handle the WorkflowRun "creating" event.
     */
    public function creating(WorkflowRun $workflowRun): void
    {
        if (Auth::check() && is_null($workflowRun->created_by)) {
            $workflowRun->created_by = Auth::id();
        }
    }

    /**
     * Handle the WorkflowRun "updated" event.
     */
    public function updated(WorkflowRun $workflowRun): void
    {
        //
    }

    /**
     * Handle the WorkflowRun "creating" event.
     */
    public function updating(WorkflowRun $workflowRun): void
    {
        if (Auth::check() && is_null($workflowRun->updated_by)) {
            $workflowRun->updated_by = Auth::id();
        }
    }

    /**
     * Handle the WorkflowRun "deleted" event.
     */
    public function deleted(WorkflowRun $workflowRun): void
    {
        //
    }

    /**
     * Handle the WorkflowRun "restored" event.
     */
    public function restored(WorkflowRun $workflowRun): void
    {
        //
    }

    /**
     * Handle the WorkflowRun "force deleted" event.
     */
    public function forceDeleted(WorkflowRun $workflowRun): void
    {
        //
    }
}
