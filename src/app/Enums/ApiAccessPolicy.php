<?php

declare(strict_types=1);

namespace App\Enums;

enum ApiAccessPolicy: int
{
    case PublicApi = 1;
    case InternalApi = 2;
    case PartnerApi = 3;
    case CompositeApi = 4;

    /**
     * Returns the human-readable display name for the API access policy.
     *
     * @return string The display name of the policy.
     */
    public function displayName(): string
    {
        return match($this) {
            ApiAccessPolicy::PublicApi => 'Public API',
            ApiAccessPolicy::InternalApi => 'Internal API',
            ApiAccessPolicy::PartnerApi => 'Partner API',
            ApiAccessPolicy::CompositeApi => 'Composite API',
        };
    }

    /**
     * Returns a description of the API access policy.
     *
     * @return string The description of the policy.
     */
    public function description(): string
    {
        return match($this) {
            ApiAccessPolicy::PublicApi => 'Open to any developer or user without authentication. Used for public data and services that do not require access control, though often subject to rate limits or a pricing plan.',
            ApiAccessPolicy::InternalApi => 'Restricted to internal applications and services within the organization. Not exposed to external parties and often relies on network-level security.',
            ApiAccessPolicy::PartnerApi => 'Exposed only to specific, trusted business partners. Access is controlled by formal agreements and is not available to the general public.',
            ApiAccessPolicy::CompositeApi => 'A type of API that combines multiple separate API calls (which could be to internal or partner APIs) into a single API request. This simplifies the logic for the client application.',
        };
    }

    /**
     * Converts the API access policy enum to an array representation.
     *
     * Returns an associative array containing the enum's value, name,
     * display name, and description.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->value,
            'name' => $this->name,
            'display_name' => $this->displayName(),
            'description' => $this->description(),
        ];
    }
}
