<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Provides functionality for models with a self-referencing parent-child relationship.
 *
 * @property-read ?int $parent_id
 *
 * @mixin Model
 */
trait HasRelatives
{
    /**
     * Get the children models.
     *
     * This defines the "has many" side of the self-referencing relationship.
     *
     * @return HasMany<Model>
     */
    public function children(): HasMany
    {
        return $this->hasMany(static::class, 'parent_id');
    }

    /**
     * Get the parent model.
     *
     * This defines the "belongs to" side of the self-referencing relationship.
     *
     * @return BelongsTo<Model, Model>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(static::class, 'parent_id');
    }

    /**
     * Check if this Record is a root record.
     *
     * @return bool
     */
    public function isRoot(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Check if the model has children.
     *
     * This is more efficient than checking `count($this->children)` as it
     * executes a lightweight `EXISTS` query instead of loading the
     * entire collection.
     *
     * @return bool
     */
    public function hasChildren(): bool
    {
        return $this->children()->exists();
    }

    /**
     * Check if the model has a parent.
     */
    public function hasParent(): bool
    {
        return ! is_null($this->parent_id);
    }

    /**
     * Scope a query to only include models that are parents (top-level).
     */
    public function scopeOnlyParents(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    /**
     * Scope a query to only include models that are children.
     */
    public function scopeOnlyChildren(Builder $query): void
    {
        $query->whereNotNull('parent_id');
    }
}
