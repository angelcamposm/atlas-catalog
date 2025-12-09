<?php

declare(strict_types=1);

namespace App\Enums;

enum LicenseModel: string
{
    case Community = 'community';
    case ConsumptionVolume = 'consumption_volume';
    case CreditsBased = 'credits_based';
    case FlatFeeSubscription = 'flat_fee';
    case Freemium = 'freemium';
    case OpenSource = 'opensource';
    case PerActiveUser = 'per_active_user';
    case PerConcurrentUser = 'per_concurrent_user';
    case PerCore = 'per_core';
    case PerDevice = 'per_device';
    case PerInstance = 'per_instance';
    case PerNamedUser = 'per_named_user';
    case Perpetual = 'perpetual';
    case SiteLicense = 'site_license';

    /**
     * Get the human-readable label for the license model.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::Community => 'Community Edition',
            self::ConsumptionVolume => 'Pay-as-you-go (Volume)',
            self::CreditsBased => 'Pre-paid Credits',
            self::FlatFeeSubscription => 'Tiered Usage',
            self::Freemium => 'Freemium',
            self::OpenSource => 'OpenSource License (FOSS)',
            self::PerActiveUser => 'Active User (Monthly)',
            self::PerConcurrentUser => 'By Concurrent User',
            self::PerCore => 'Per CPU Core',
            self::PerDevice => 'Per Device/Endpoint',
            self::PerInstance => 'Per Instance',
            self::PerNamedUser => 'Per Named User',
            self::Perpetual => 'Perpetual License',
            self::SiteLicense => 'Site License',
        };
    }
}
