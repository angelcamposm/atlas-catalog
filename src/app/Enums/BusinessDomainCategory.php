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
}
