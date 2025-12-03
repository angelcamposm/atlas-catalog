<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Represents the classification of business domains.
 *
 * This enumeration includes the following classifications:
 * - Core: Represents the core domains that are central to the business.
 * - Generic: Represents domains that are standard or common across different
 *   businesses.
 * - Supporting: Represents domains that provide support or auxiliary functions
 *   for the core operations.
 */
enum BusinessDomainCategory: string
{
    case Core = 'C';
    case Generic = 'G';
    case Supporting = 'S';

    /**
     * Returns the human-readable name of the category.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::Core => 'Core',
            self::Generic => 'Generic',
            self::Supporting => 'Supporting',
        };
    }

    /**
     * Returns a color associated with the category for UI purposes.
     */
    public function color(): string
    {
        return match ($this) {
            self::Core => 'red',
            self::Supporting => 'blue',
            self::Generic => 'gray',
        };
    }
}
