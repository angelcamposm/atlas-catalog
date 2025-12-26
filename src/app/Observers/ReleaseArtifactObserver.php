<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ReleaseArtifact;
use Illuminate\Support\Facades\Auth;

class ReleaseArtifactObserver
{
    /**
     * Handle the ReleaseArtifact "created" event.
     */
    public function created(ReleaseArtifact $releaseArtifact): void
    {
        //
    }

    /**
     * Handle the ReleaseArtifact "creating" event.
     */
    public function creating(ReleaseArtifact $releaseArtifact): void
    {
        if (Auth::check() && is_null($releaseArtifact->created_by)) {
            $releaseArtifact->created_by = Auth::id();
        }
    }

    /**
     * Handle the ReleaseArtifact "updated" event.
     */
    public function updated(ReleaseArtifact $releaseArtifact): void
    {
        //
    }

    /**
     * Handle the ReleaseArtifact "updating" event.
     */
    public function updating(ReleaseArtifact $releaseArtifact): void
    {
        if (Auth::check()) {
            $releaseArtifact->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ReleaseArtifact "deleted" event.
     */
    public function deleted(ReleaseArtifact $releaseArtifact): void
    {
        //
    }

    /**
     * Handle the ReleaseArtifact "restored" event.
     */
    public function restored(ReleaseArtifact $releaseArtifact): void
    {
        //
    }

    /**
     * Handle the ReleaseArtifact "force deleted" event.
     */
    public function forceDeleted(ReleaseArtifact $releaseArtifact): void
    {
        //
    }
}
