<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

readonly class RgbColorRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail('The :attribute must be a string.');
            return;
        }

        if (! preg_match('/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/', $value, $matches)) {
            $fail('The :attribute must be a valid RGB color string.');
            return;
        }

        // Check if the color values are within the valid range (0-255)
        for ($index = 1; $index <= 3; $index++) {
            if ($matches[$index] < 0 || $matches[$index] > 255) {
                $fail('The :attribute must have RGB values between 0 and 255.');
                return;
            }
        }
    }
}
