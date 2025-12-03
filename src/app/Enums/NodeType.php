<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Represents the type of node in a system.
 *
 * This enum defines four possible types of nodes:
 * - Hybrid: Represented by 'H', indicating a combination of two or more types.
 * - Physical: Represented by 'P', indicating a physical node.
 * - Unknown: Represented by 'U', indicating an unspecified type.
 * - Virtual: Represented by 'V', indicating a virtualized node.
 *
 * The `displayName` method provides a readable name for each node type.
 */
enum NodeType: string
{
    case Hybrid = 'H';
    case Physical = 'P';
    case Unknown = 'U';
    case Virtual = 'V';

    public function displayName(): string
    {
        return match ($this) {
            self::Hybrid => 'Hybrid',
            self::Physical => 'Physical',
            self::Unknown => 'Unknown',
            self::Virtual => 'Virtual',
        };
    }

    /**
     * Returns a color associated with the node type for UI purposes.
     */
    public function color(): string
    {
        return match ($this) {
            self::Hybrid => 'purple',
            self::Physical => 'blue',
            self::Virtual => 'green',
            self::Unknown => 'gray',
        };
    }
}
