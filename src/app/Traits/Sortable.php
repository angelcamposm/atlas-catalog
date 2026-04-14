<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Provides sorting functionality for Eloquent models.
 *
 * This trait allows models to sort results based on query parameters:
 * ?sort=field_name (ascending)
 * ?sort=-field_name (descending)
 *
 * Each model using this trait must define a $sortable property specifying which fields can be sorted.
 *
 * @example
 * class Component extends Model {
 *     use Sortable;
 *     protected array $sortable = ['id', 'name', 'created_at'];
 * }
 *
 * // Usage in controller:
 * Component::sort($request)->paginate()
 * // ?sort=name for ascending
 * // ?sort=-created_at for descending
 */
trait Sortable
{
    /**
     * Scope to apply sorting from query parameters.
     *
     * Supports ascending (field_name) and descending (-field_name) ordering.
     * Only fields defined in the $sortable array are considered.
     *
     * @param Builder $query The query builder instance
     * @param Request $request The HTTP request
     * @return Builder The modified query builder
     */
    public function scopeSort(Builder $query, Request $request): Builder
    {
        $sort = $request->query('sort');

        if (!$sort) {
            return $query;
        }

        // Default sortable fields if not specified in model
        $sortable = $this->sortable ?? ['id', 'created_at', 'updated_at'];

        // Support ?sort=-field for descending order
        $direction = 'asc';
        if (str_starts_with($sort, '-')) {
            $sort = substr($sort, 1);
            $direction = 'desc';
        }

        // Only allow fields in the sortable list
        if (in_array($sort, $sortable, true)) {
            $query->orderBy($sort, $direction);
        }

        return $query;
    }
}
