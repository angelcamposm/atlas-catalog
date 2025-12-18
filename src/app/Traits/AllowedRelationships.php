<?php

declare(strict_types=1);

namespace App\Traits;

use LogicException;
use Illuminate\Support\Str;

/**
 * Provides functionality to filter and validate eager-loading relationships
 * based on a predefined list within the consuming class.
 */
trait AllowedRelationships
{
    /**
     * Filters requested relationships against a predefined list.
     *
     * This method parses a comma-separated string of relationships, validates them
     * against a class constant `ALLOWED_RELATIONSHIPS`, and returns a sanitized
     * array of relationships that can be safely passed to Eloquent's `with()` method.
     *
     * @param string|null $with The comma-separated string of requested relationships (e.g., from a request query).
     *
     * @return string[] The filtered list of valid relationships.
     *
     * @throws LogicException If the ALLOWED_RELATIONSHIPS constant is defined but is not an array.
     */
    protected static function filterAllowedRelationships(?string $with): array
    {
        if (empty($with)) {
            return [];
        }

        $allowedRelationships = self::getDefinedAllowedRelationships();

        if (empty($allowedRelationships)) {
            return [];
        }

        $requestedRelationships = explode(';', $with);
        $validatedRelationships = [];

        foreach ($requestedRelationships as $relationship) {
            $baseRelationship = Str::before($relationship, ':');

            if (in_array($baseRelationship, $allowedRelationships, true)) {
                $validatedRelationships[] = $relationship;
            }
        }

        return $validatedRelationships;
    }

    /**
     * Retrieves the ALLOWED_RELATIONSHIPS constant from the calling class.
     *
     * @return string[] The list of allowed relationships.
     * @throws LogicException If the constant is defined but is not an array.
     */
    private static function getDefinedAllowedRelationships(): array
    {
        $class = static::class;

        if (! defined("$class::ALLOWED_RELATIONSHIPS")) {
            // The constant is optional. If not defined, no relationships are allowed.
            return [];
        }

        $content = constant("$class::ALLOWED_RELATIONSHIPS");

        if (! is_array($content)) {
            // For better error handling, a custom exception could be used here.
            throw new LogicException('The ALLOWED_RELATIONSHIPS constant in ' . $class . ' must be an array of strings.');
        }

        return $content;
    }
}
