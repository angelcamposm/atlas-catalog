<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Enum DiscoverySource
 *
 * Represents the various sources of discovery.
 *
 * The DiscoverySource enumeration is used to define the possible
 * origins where a discovery process could be initiated. It provides
 * predefined constants to standardize these sources.
 *
 * Cases:
 * - Manual: Indicates a manually initiated discovery.
 * - Pipeline: Indicates a discovery initiated through a CI-CD pipeline.
 * - Scan: Indicates a discovery initiated by a scanning process.
 * @method static cases()
 * @method static values()
 */
enum DiscoverySource: string
{
    case Manual = 'Manual';
    case Pipeline = 'Pipeline';
    case Scan = 'Scan';

    /**
     * Returns the human-readable name of the source.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::Manual => 'Manual',
            self::Pipeline => 'Pipeline',
            self::Scan => 'Scan',
        };
    }

    /**
     * Returns an icon name associated with the source for UI purposes.
     */
    public function icon(): string
    {
        return match ($this) {
            self::Manual => 'hand',
            self::Pipeline => 'cogs',
            self::Scan => 'search',
        };
    }
}
