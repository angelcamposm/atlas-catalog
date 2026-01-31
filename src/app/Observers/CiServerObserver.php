<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\CiServer;
use Illuminate\Support\Facades\Auth;

class CiServerObserver
{
    /**
     * Handle the CiServer "created" event.
     */
    public function created(CiServer $ciServer): void
    {
        //
    }

    /**
     * Handle the CiServer "creating" event.
     */
    public function creating(CiServer $ciServer): void
    {
        if (Auth::check() && is_null($ciServer->created_by)) {
            $ciServer->created_by = Auth::id();
        }
    }

    /**
     * Handle the CiServer "updated" event.
     */
    public function updated(CiServer $ciServer): void
    {
        //
    }

    /**
     * Handle the CiServer "updating" event.
     */
    public function updating(CiServer $ciServer): void
    {
        if (Auth::check()) {
            $ciServer->updated_by = Auth::id();
        }
    }

    /**
     * Handle the CiServer "deleted" event.
     */
    public function deleted(CiServer $ciServer): void
    {
        //
    }

    /**
     * Handle the CiServer "restored" event.
     */
    public function restored(CiServer $ciServer): void
    {
        //
    }

    /**
     * Handle the CiServer "force deleted" event.
     */
    public function forceDeleted(CiServer $ciServer): void
    {
        //
    }
}
