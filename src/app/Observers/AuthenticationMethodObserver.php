<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\AuthenticationMethod;
use Illuminate\Support\Facades\Auth;

class AuthenticationMethodObserver
{
    /**
     * Handle the AuthenticationMethod "created" event.
     */
    public function created(AuthenticationMethod $authenticationMethod): void
    {
        //
    }

    /**
     * Handle the AuthenticationMethod "creating" event.
     */
    public function creating(AuthenticationMethod $authenticationMethod): void
    {
        if (Auth::check() && is_null($authenticationMethod->created_by)) {
            $authenticationMethod->created_by = Auth::id();
        }
    }

    /**
     * Handle the AuthenticationMethod "updated" event.
     */
    public function updated(AuthenticationMethod $authenticationMethod): void
    {
        //
    }

    /**
     * Handle the AuthenticationMethod "creating" event.
     */
    public function updating(AuthenticationMethod $authenticationMethod): void
    {
        if (Auth::check() && is_null($authenticationMethod->updated_by)) {
            $authenticationMethod->updated_by = Auth::id();
        }
    }

    /**
     * Handle the AuthenticationMethod "deleted" event.
     */
    public function deleted(AuthenticationMethod $authenticationMethod): void
    {
        //
    }

    /**
     * Handle the AuthenticationMethod "restored" event.
     */
    public function restored(AuthenticationMethod $authenticationMethod): void
    {
        //
    }

    /**
     * Handle the AuthenticationMethod "force deleted" event.
     */
    public function forceDeleted(AuthenticationMethod $authenticationMethod): void
    {
        //
    }
}
