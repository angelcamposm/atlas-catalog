<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Manages `created_by` and `updated_by` user relationships for a model.
 *
 * This trait should be used on models that have `created_by` and `updated_by`
 * foreign key columns referencing the `users` table.
 *
 * @property ?int $created_by
 * @property ?int $updated_by
 * @property-read ?User $creator
 * @property-read ?User $updater
 *
 * @mixin Model
 */
trait BelongsToUser
{
    /**
     * Get the user who created this record.
     *
     * @return BelongsTo<User>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this record.
     *
     * @return BelongsTo<User>
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Check if this record has a creator.
     *
     * @return bool
     */
    public function hasCreator(): bool
    {
        return ! is_null($this->created_by);
    }

    /**
     * Check if this record has an updater.
     *
     * @return bool
     */
    public function hasUpdater(): bool
    {
        return ! is_null($this->updated_by);
    }
}
