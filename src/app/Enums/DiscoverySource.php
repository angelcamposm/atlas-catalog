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
 */
enum DiscoverySource: string
{
    case Manual = 'Manual';
    case Pipeline = 'Pipeline';
    case Scan = 'Scan';
}
