<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Provides filtering functionality for Eloquent models.
 *
 * This trait allows models to filter results based on query parameters in the format:
 * ?filter[field]=value&filter[another_field]=another_value
 *
 * Each model using this trait must define a $filterable property specifying which fields can be filtered.
 *
 * @example
 * class Component extends Model {
 *     use Filterable;
 *     protected array $filterable = ['domain_id', 'status_id', 'platform_id'];
 * }
 *
 * // Usage in controller:
 * Component::filter($request)->paginate()
 */
trait Filterable
{
    /**
     * Scope to apply filters from query parameters.
     *
     * Only fields defined in the $filterable array are considered.
     * This prevents SQL injection by using parameterized queries.
     *
     * @param Builder $query The query builder instance
     * @param Request $request The HTTP request
     * @return Builder The modified query builder
     */
    public function scopeFilter(Builder $query, Request $request): Builder
    {
        $filters = $request->query('filter');

        if (!is_array($filters)) {
            return $query;
        }

        // Get the filterable fields from the model instance
        $filterable = $this->filterable ?? [];

        foreach ($filters as $field => $value) {
            // Only allow fields in the filterable list
            if (!in_array($field, $filterable, true)) {
                continue;
            }

            // Apply simple equality filter
            $query->where($field, $value);
        }

        return $query;
    }
}
