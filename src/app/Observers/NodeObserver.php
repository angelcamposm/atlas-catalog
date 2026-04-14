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
        if (is_null($node->cpu_cores)) {
            $node->cpu_cores = 1;
        }

        if (is_null($node->cpu_threads)) {
            $node->cpu_threads = 1;
        }

        if (is_null($node->os)) {
            $node->os = 'Unknown';
        }

        if (is_null($node->os_version)) {
            $node->os_version = 'Unknown';
        }

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
     * Handle the Node "updating" event.
     */
    public function updating(Node $node): void
    {
        if (Auth::check()) {
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
