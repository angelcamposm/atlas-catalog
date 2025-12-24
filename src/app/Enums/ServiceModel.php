<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Represents various cloud computing service models.
 *
 * This enum defines different types of "as a Service" (aaS) delivery models
 * commonly used in cloud computing and SaaS industries. Each case represents
 * a specific service model with its abbreviated form as the enum value.
 *
 * @package App\Enums
 */
enum ServiceModel: string
{
    case BaaS = 'baas';
    case CaaS = 'caas';
    case DaaS = 'DaaS';
    case DBaaS = 'dbaas';
    case FaaS = 'faas';
    case IaaS = 'iaas';
    case IDaaS = 'idaas';
    case PaaS = 'paas';
    case SaaS = 'saas';
    case XaaS = 'xaas';

    /**
     * Returns the display name corresponding to the current enum value.
     *
     * @return string The display name representation of the enum value.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::BaaS => 'Backend as a Service',
            self::CaaS => 'Container as a Service',
            self::DaaS => 'Desktop as a Service',
            self::DBaaS => 'Database as a Service',
            self::FaaS => 'Function as a Service',
            self::IaaS => 'Infrastructure as a Service',
            self::PaaS => 'Platform as a Service',
            self::SaaS => 'Software as a Service',
            self::XaaS => 'Anything as a Service',
            self::IDaaS => 'Identity as a Service',
        };
    }

    /**
     * Retrieves the label associated with the current enum value.
     *
     * @return string The label representation of the enum value.
     */
    public function label(): string
    {
        return match($this) {
            self::BaaS => 'BaaS',
            self::CaaS => 'CaaS',
            self::DaaS => 'DaaS',
            self::DBaaS => 'DBaaS',
            self::FaaS => 'FaaS',
            self::IaaS => 'IaaS',
            self::IDaaS => 'IDaaS',
            self::PaaS => 'PaaS',
            self::SaaS => 'SaaS',
            self::XaaS => 'XaaS',
        };
    }
}
