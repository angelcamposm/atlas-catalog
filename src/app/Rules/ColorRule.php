<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

/**
 * Validates that a value is a valid color (hex, rgb, or named CSS color).
 */
readonly class ColorRule implements ValidationRule
{
    /** @param Closure(string, ?string=): PotentiallyTranslatedString $fail */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail('The :attribute must be a string.');
            return;
        }

        // Accept hex colors (#FFF, #FFFFFF, FFF, FFFFFF)
        if (preg_match('/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/', $value)) {
            return;
        }

        // Accept rgb/rgba colors
        if (preg_match('/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+))?\s*\)$/', $value)) {
            return;
        }

        // Accept named CSS colors
        $namedColors = [
            'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
            'pink', 'brown', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'navy',
            'teal', 'maroon', 'olive', 'aqua', 'silver', 'fuchsia',
        ];

        if (in_array(strtolower($value), $namedColors, true)) {
            return;
        }

        $fail('The :attribute must be a valid color (hex, rgb, rgba, or named CSS color).');
    }
}
