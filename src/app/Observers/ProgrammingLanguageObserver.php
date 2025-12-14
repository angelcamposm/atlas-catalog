<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ProgrammingLanguage;
use Illuminate\Support\Facades\Auth;

class ProgrammingLanguageObserver
{
    /**
     * Handle the ProgrammingLanguage "created" event.
     */
    public function created(ProgrammingLanguage $programmingLanguage): void
    {
        //
    }

    /**
     * Handle the ProgrammingLanguage "creating" event.
     */
    public function creating(ProgrammingLanguage $programmingLanguage): void
    {
        if (Auth::check() && is_null($programmingLanguage->created_by)) {
            $programmingLanguage->created_by = Auth::id();
        }
    }

    /**
     * Handle the ProgrammingLanguage "updated" event.
     */
    public function updated(ProgrammingLanguage $programmingLanguage): void
    {
        //
    }

    /**
     * Handle the ProgrammingLanguage "updating" event.
     */
    public function updating(ProgrammingLanguage $programmingLanguage): void
    {
        if (Auth::check()) {
            $programmingLanguage->updated_by = Auth::id();
        }
    }

    /**
     * Handle the ProgrammingLanguage "deleted" event.
     */
    public function deleted(ProgrammingLanguage $programmingLanguage): void
    {
        //
    }

    /**
     * Handle the ProgrammingLanguage "restored" event.
     */
    public function restored(ProgrammingLanguage $programmingLanguage): void
    {
        //
    }

    /**
     * Handle the ProgrammingLanguage "force deleted" event.
     */
    public function forceDeleted(ProgrammingLanguage $programmingLanguage): void
    {
        //
    }
}
