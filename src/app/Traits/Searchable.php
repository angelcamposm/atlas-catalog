<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Provides full-text search functionality for Eloquent models.
 *
 * This trait allows models to search across multiple fields based on query parameters:
 * ?search=term
 *
 * Each model using this trait must define a $searchable property specifying which fields to search.
 *
 * @example
 * class Component extends Model {
 *     use Searchable;
 *     protected array $searchable = ['name', 'display_name', 'description'];
 * }
 *
 * // Usage in controller:
 * Component::search($request)->paginate()
 * // ?search=api will match any field containing "api"
 */
trait Searchable
{
    /**
     * Scope to apply search from query parameters.
     *
     * Searches across all fields defined in the $searchable array using LIKE queries.
     * The search term is wrapped with % for partial matching.
     * Uses parameterized queries to prevent SQL injection.
     *
     * @param Builder $query The query builder instance
     * @param Request $request The HTTP request
     * @return Builder The modified query builder
     */
    public function scopeSearch(Builder $query, Request $request): Builder
    {
        $term = $request->query('search');

        // Get searchable fields from the model
        $searchable = $this->searchable ?? [];

        if (!$term || empty($searchable)) {
            return $query;
        }

        // Use orWhere to search across multiple fields
        return $query->where(function (Builder $q) use ($term, $searchable) {
            foreach ($searchable as $field) {
                $q->orWhere($field, 'like', "%{$term}%");
            }
        });
    }
}
