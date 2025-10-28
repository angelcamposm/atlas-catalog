<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\LinkType;
use Illuminate\Support\Facades\Auth;

class LinkTypeObserver
{
    /**
     * Handle the LinkType "created" event.
     */
    public function created(LinkType $linkType): void
    {
        //
    }

    /**
     * Handle the LinkType "creating" event.
     */
    public function creating(LinkType $linkType): void
    {
        if (Auth::check() && is_null($linkType->created_by)) {
            $linkType->created_by = Auth::id();
        }
    }

    /**
     * Handle the LinkType "updated" event.
     */
    public function updated(LinkType $linkType): void
    {
        //
    }

    /**
     * Handle the LinkType "creating" event.
     */
    public function updating(LinkType $linkType): void
    {
        if (Auth::check() && is_null($linkType->updated_by)) {
            $linkType->updated_by = Auth::id();
        }
    }

    /**
     * Handle the LinkType "deleted" event.
     */
    public function deleted(LinkType $linkType): void
    {
        //
    }

    /**
     * Handle the LinkType "restored" event.
     */
    public function restored(LinkType $linkType): void
    {
        //
    }

    /**
     * Handle the LinkType "force deleted" event.
     */
    public function forceDeleted(LinkType $linkType): void
    {
        //
    }
}
