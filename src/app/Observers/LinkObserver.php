<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Link;
use Illuminate\Support\Facades\Auth;

class LinkObserver
{
    /**
     * Handle the Link "created" event.
     */
    public function created(Link $link): void
    {
        //
    }

    /**
     * Handle the Link "creating" event.
     */
    public function creating(Link $link): void
    {
        if (Auth::check() && is_null($link->created_by)) {
            $link->created_by = Auth::id();
        }
    }

    /**
     * Handle the Link "updated" event.
     */
    public function updated(Link $link): void
    {
        //
    }

    /**
     * Handle the Link "updating" event.
     */
    public function updating(Link $link): void
    {
        if (Auth::check()) {
            $link->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Link "deleted" event.
     */
    public function deleted(Link $link): void
    {
        //
    }

    /**
     * Handle the Link "restored" event.
     */
    public function restored(Link $link): void
    {
        //
    }

    /**
     * Handle the Link "force deleted" event.
     */
    public function forceDeleted(Link $link): void
    {
        //
    }
}
