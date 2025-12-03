<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\WorkflowJob;
use Illuminate\Support\Facades\Auth;

class WorkflowJobObserver
{
    /**
     * Handle the WorkflowJob "created" event.
     */
    public function created(WorkflowJob $workflowJob): void
    {
        //
    }

    /**
     * Handle the WorkflowJob "creating" event.
     */
    public function creating(WorkflowJob $workflowJob): void
    {
        if (Auth::check() && is_null($workflowJob->created_by)) {
            $workflowJob->created_by = Auth::id();
        }
    }

    /**
     * Handle the WorkflowJob "updated" event.
     */
    public function updated(WorkflowJob $workflowJob): void
    {
        //
    }

    /**
     * Handle the WorkflowJob "creating" event.
     */
    public function updating(WorkflowJob $workflowJob): void
    {
        if (Auth::check() && is_null($workflowJob->updated_by)) {
            $workflowJob->updated_by = Auth::id();
        }
    }

    /**
     * Handle the WorkflowJob "deleted" event.
     */
    public function deleted(WorkflowJob $workflowJob): void
    {
        //
    }

    /**
     * Handle the WorkflowJob "restored" event.
     */
    public function restored(WorkflowJob $workflowJob): void
    {
        //
    }

    /**
     * Handle the WorkflowJob "force deleted" event.
     */
    public function forceDeleted(WorkflowJob $workflowJob): void
    {
        //
    }
}
