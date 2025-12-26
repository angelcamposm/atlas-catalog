<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the levels of business criticality for a system, component, or service.
 *
 * Criticality indicates the impact on the business if the asset becomes unavailable or compromised.
 */
enum BusinessCriticality: string
{
    case MissionCritical = 'mission_critical';
    case BusinessCritical = 'business_critical';
    case BusinessOperational = 'business_operational';
    case Administrative = 'administrative';

    /**
     * Returns the display name corresponding to the current enum value.
     *
     * @return string The display name representation of the enum value.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::MissionCritical => 'Mission Critical',
            self::BusinessCritical => 'Business Critical',
            self::BusinessOperational => 'Business Operational',
            self::Administrative => 'Administrative',
        };
    }

    /**
     * Returns a detailed description of the business criticality level.
     *
     * @return string A comprehensive explanation of the criticality level.
     */
    public function description(): string
    {
        return match ($this) {
            self::MissionCritical => 'Essential for the survival of the business. Failure results in immediate and significant financial loss, legal liability, or reputational damage.',
            self::BusinessCritical => 'Vital for core business operations. Failure causes significant disruption and financial loss but may not immediately threaten business survival.',
            self::BusinessOperational => 'Supports normal business operations. Failure causes inconvenience and reduced efficiency but can be managed with workarounds for a short time.',
            self::Administrative => 'Used for non-essential functions or internal administrative tasks. Failure has minimal impact on business operations or revenue.',
        };
    }
}
