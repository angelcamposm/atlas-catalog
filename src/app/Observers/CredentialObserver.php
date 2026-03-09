<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Credential;
use Illuminate\Support\Facades\Auth;

class CredentialObserver
{
    /**
     * Handle the Credential "created" event.
     */
    public function created(Credential $credential): void
    {
        //
    }

    /**
     * Handle the Credential "creating" event.
     */
    public function creating(Credential $credential): void
    {
        if (Auth::check() && is_null($credential->created_by)) {
            $credential->created_by = Auth::id();
        }
    }

    /**
     * Handle the Credential "updated" event.
     */
    public function updated(Credential $credential): void
    {
        //
    }

    /**
     * Handle the Credential "updating" event.
     */
    public function updating(Credential $credential): void
    {
        if (Auth::check()) {
            $credential->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Credential "deleted" event.
     */
    public function deleted(Credential $credential): void
    {
        //
    }

    /**
     * Handle the Credential "restored" event.
     */
    public function restored(Credential $credential): void
    {
        //
    }

    /**
     * Handle the Credential "force deleted" event.
     */
    public function forceDeleted(Credential $credential): void
    {
        //
    }
}
