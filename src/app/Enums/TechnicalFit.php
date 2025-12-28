<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the technical quality and suitability of an application or component.
 *
 * Technical fit assesses code quality, maintainability, scalability, and alignment with technical standards.
 */
enum TechnicalFit: string
{
    case Adequate = 'adequate';
    case Excellent = 'excellent';
    case Poor = 'poor';
    case Unacceptable = 'unacceptable';

    /**
     * Returns the display name corresponding to the current enum value.
     *
     * @return string The display name representation of the enum value.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::Adequate => 'Adequate',
            self::Excellent => 'Excellent',
            self::Poor => 'Poor',
            self::Unacceptable => 'Unacceptable',
        };
    }

    /**
     * Returns a detailed description of the technical fit level.
     *
     * @return string A comprehensive explanation of the fit level.
     */
    public function description(): string
    {
        return match ($this) {
            self::Adequate => 'The application is stable and serviceable but may use slightly older technologies or have minor technical debt. Meets current technical needs.',
            self::Excellent => 'The application uses modern technologies, follows best practices, is highly maintainable, scalable, and secure. No technical debt.',
            self::Poor => 'The application has significant technical debt, uses obsolete technologies, is difficult to maintain, or has performance/security issues. Requires remediation.',
            self::Unacceptable => 'The application poses a severe risk due to critical security vulnerabilities, instability, or inability to support business needs. Requires immediate replacement or retirement.',
        };
    }
}
