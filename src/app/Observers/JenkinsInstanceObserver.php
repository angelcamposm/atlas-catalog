<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\JenkinsInstance;
use Illuminate\Support\Facades\Auth;

class JenkinsInstanceObserver
{
    /**
     * Handle the JenkinsInstance "created" event.
     */
    public function created(JenkinsInstance $jenkinsInstance): void
    {
        //
    }

    /**
     * Handle the JenkinsInstance "creating" event.
     */
    public function creating(JenkinsInstance $jenkinsInstance): void
    {
        if (is_null($jenkinsInstance->driver)) {
            $jenkinsInstance->driver = 'jenkins';
        }

        if (Auth::check() && is_null($jenkinsInstance->created_by)) {
            $jenkinsInstance->created_by = Auth::id();
        }
    }

    /**
     * Handle the JenkinsInstance "updated" event.
     */
    public function updated(JenkinsInstance $jenkinsInstance): void
    {
        //
    }

    /**
     * Handle the JenkinsInstance "updating" event.
     */
    public function updating(JenkinsInstance $jenkinsInstance): void
    {
        if (Auth::check()) {
            $jenkinsInstance->updated_by = Auth::id();
        }
    }

    /**
     * Handle the JenkinsInstance "deleted" event.
     */
    public function deleted(JenkinsInstance $jenkinsInstance): void
    {
        //
    }

    /**
     * Handle the JenkinsInstance "restored" event.
     */
    public function restored(JenkinsInstance $jenkinsInstance): void
    {
        //
    }

    /**
     * Handle the JenkinsInstance "force deleted" event.
     */
    public function forceDeleted(JenkinsInstance $jenkinsInstance): void
    {
        //
    }
}
