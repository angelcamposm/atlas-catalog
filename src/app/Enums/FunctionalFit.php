<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the functional suitability of an application or component.
 *
 * Functional fit assesses how well the application meets the business requirements and user needs.
 */
enum FunctionalFit: string
{
    case Appropriate = 'appropriate';
    case Insufficient = 'insufficient';
    case Perfect = 'perfect';
    case Unreasonable = 'unreasonable';

    /**
     * Returns the display name corresponding to the current enum value.
     *
     * @return string The display name representation of the enum value.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::Perfect => 'Perfect',
            self::Appropriate => 'Appropriate',
            self::Insufficient => 'Insufficient',
            self::Unreasonable => 'Unreasonable',
        };
    }

    /**
     * Returns a detailed description of the functional fit level.
     *
     * @return string A comprehensive explanation of the fit level.
     */
    public function description(): string
    {
        return match ($this) {
            self::Perfect => 'The application fully meets all business requirements and user needs with high efficiency and user satisfaction. No functional gaps.',
            self::Appropriate => 'The application meets most core business requirements but may have some minor functional gaps or usability issues. Workarounds may be needed.',
            self::Insufficient => 'The application fails to meet several key business requirements, has significant functional gaps, or poor usability. Hinders business productivity.',
            self::Unreasonable => 'The application does not meet critical business requirements or is no longer useful to the business. Users actively avoid using it.',
        };
    }
}
