<?php

declare(strict_types=1);

namespace App\Rules;

use App\Enums\Color;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

readonly class NamedColorRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (Color::tryFrom(strtolower($value)) === null) {
            $fail("The :attribute must be a valid color (e.g., a CSS color name like 'red').");
        }
    }
}
