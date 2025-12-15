<?php

declare(strict_types=1);

namespace App\Enums;

enum InfrastructureType: string
{
    case OnPremise = 'on-premise';
    case PublicCloud = 'public-cloud';
    case PrivateCloud = 'private-cloud';
    case HybridCloud = 'hybrid-cloud';
    case MultiCloud = 'multi-cloud';

    /**
     * Get the human-readable label for the infrastructure type.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::OnPremise => 'On-Premise',
            self::PublicCloud => 'Public Cloud',
            self::PrivateCloud => 'Private Cloud',
            self::HybridCloud => 'Hybrid Cloud',
            self::MultiCloud => 'Multi-Cloud',
        };
    }

    /**
     * Get the human-readable description for the infrastructure type.
     *
     * @return string
     */
    public function description(): string
    {
        return match ($this) {
            self::OnPremise => 'Infrastructure hosted within an organization\'s own data center.',
            self::PublicCloud => 'Infrastructure provided by a third-party cloud provider (e.g., AWS, Azure, GCP).',
            self::PrivateCloud => 'A cloud environment dedicated to a single organization.',
            self::HybridCloud => 'A combination of on-premise infrastructure with public and/or private cloud services.',
            self::MultiCloud => 'Utilizing services from multiple public cloud providers.',
        };
    }
}
