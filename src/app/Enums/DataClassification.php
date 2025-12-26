<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the data classification levels based on sensitivity and confidentiality.
 *
 * Classification helps in applying appropriate security controls and handling procedures.
 */
enum DataClassification: string
{
    case Public = 'l0';
    case Sensitive = 'l1';
    case Restricted = 'l2';
    case Confidential = 'l3';

    /**
     * Returns the display name corresponding to the current enum value.
     *
     * @return string The display name representation of the enum value.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::Public => 'Public / Unclassified (L-0)',
            self::Sensitive => 'Sensitive (L-1)',
            self::Restricted => 'Restricted (L-2)',
            self::Confidential => 'Confidential (L-3)',
        };
    }

    /**
     * Returns a detailed description of the data classification level.
     *
     * @return string A comprehensive explanation of the classification level.
     */
    public function description(): string
    {
        return match ($this) {
            self::Public => 'Public data that can be freely disclosed to the public without any risk of harm to the organization or individuals (e.g., marketing materials, press releases).',
            self::Sensitive => 'Sensitive data intended for use within the organization. Unauthorized disclosure could cause minor operational disruption or embarrassment (e.g., internal memos, phone directories).',
            self::Restricted => 'Restricted data that requires the highest level of protection. Unauthorized disclosure could cause catastrophic damage, severe legal penalties, or threat to national security (e.g., trade secrets, sensitive PII, encryption keys).',
            self::Confidential => 'Confidential data that requires protection. Unauthorized disclosure could cause significant financial loss, legal issues, or reputational damage (e.g., PII, financial reports, contracts).',
        };
    }
}
