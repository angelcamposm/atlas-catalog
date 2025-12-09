<?php

declare(strict_types=1);

namespace App\Enums;

enum StrategicValue: int
{
    case Differentiator = 5;
    case Competitive = 4;
    case Core = 3;
    case Support = 2;
    case Commodity = 1;

    /**
     * Get the description for the strategic value.
     *
     * @return string
     */
    public function getDescription(): string
    {
        return match ($this) {
            self::Differentiator => 'Unique to your business. If this fails or is outdated, you lose competitive advantage',
            self::Competitive => 'Capabilities where performance directly impacts revenue or customer satisfaction.',
            self::Core => 'Essential but standard. Must work efficiently, but innovation here yields lower ROI (e.g., Accounting).',
            self::Support => 'Necessary back-office functions that support the core business but do not directly touch the customer or the product.',
            self::Commodity => 'Necessary but adds no unique value. Often a candidate for heavy automation or outsourcing (e.g., Payroll).',
        };
    }

    /**
     * Get the recommended budget approach based on strategic value.
     * Returns a string indicating both budget level (High/Medium/Low/Lowest)
     * and budget type (CapEx/OpEx/Mixed) for the strategic value.
     *
     * @return string Budget approach description in format 'Level/Type'
     */
    public function budgetApproach(): string
    {
        return match($this) {
            self::Differentiator => 'High/CapEx',
            self::Competitive => 'High/Mixed',
            self::Core => 'Medium/OpEx',
            self::Support => 'Low/OpEx',
            self::Commodity => 'Lowest/OpEx',
        };
    }
}
