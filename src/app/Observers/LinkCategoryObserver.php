<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Link;
use App\Models\LinkCategory;
use Illuminate\Support\Facades\Auth;

class LinkCategoryObserver
{
    /**
     * Handle the LinkCategory "created" event.
     */
    public function created(LinkCategory $linkCategory): void
    {
        //
    }

    /**
     * Handle the LinkCategory "creating" event.
     */
    public function creating(LinkCategory $linkCategory): void
    {
        if (is_null($linkCategory->model)) {
            $linkCategory->model = strtolower(class_basename(Link::class));
        }

        if (Auth::check() && is_null($linkCategory->created_by)) {
            $linkCategory->created_by = Auth::id();
        }
    }

    /**
     * Handle the LinkCategory "updated" event.
     */
    public function updated(LinkCategory $linkCategory): void
    {
        //
    }

    /**
     * Handle the LinkCategory "updating" event.
     */
    public function updating(LinkCategory $linkCategory): void
    {
        if (is_null($linkCategory->model)) {
            $linkCategory->model = strtolower(class_basename(Link::class));
        }

        if (Auth::check()) {
            $linkCategory->updated_by = Auth::id();
        }
    }

    /**
     * Handle the LinkCategory "deleted" event.
     */
    public function deleted(LinkCategory $linkCategory): void
    {
        //
    }

    /**
     * Handle the LinkCategory "restored" event.
     */
    public function restored(LinkCategory $linkCategory): void
    {
        //
    }

    /**
     * Handle the LinkCategory "force deleted" event.
     */
    public function forceDeleted(LinkCategory $linkCategory): void
    {
        //
    }
}
