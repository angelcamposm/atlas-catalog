<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Node;
use Illuminate\Support\Facades\Auth;

class NodeObserver
{
    /**
     * Handle the Node "created" event.
     */
    public function created(Node $node): void
    {
        //
    }

    /**
     * Handle the Node "creating" event.
     */
    public function creating(Node $node): void
    {
        if (Auth::check() && is_null($node->created_by)) {
            $node->created_by = Auth::id();
        }
    }

    /**
     * Handle the Node "updated" event.
     */
    public function updated(Node $node): void
    {
        //
    }

    /**
     * Handle the Node "creating" event.
     */
    public function updating(Node $node): void
    {
        if (Auth::check() && is_null($node->updated_by)) {
            $node->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Node "deleted" event.
     */
    public function deleted(Node $node): void
    {
        //
    }

    /**
     * Handle the Node "restored" event.
     */
    public function restored(Node $node): void
    {
        //
    }

    /**
     * Handle the Node "force deleted" event.
     */
    public function forceDeleted(Node $node): void
    {
        //
    }
}
