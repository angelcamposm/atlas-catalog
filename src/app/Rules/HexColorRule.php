<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

readonly class HexColorRule implements ValidationRule
{
    /**
     * Create a new rule instance.
     *
     * @param  bool  $allowShort
     */
    public function __construct(private bool $allowShort = true)
    {}

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail('The :attribute must be a string.');
            return;
        }

        $pattern = $this->allowShort
            ? '/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/'
            : '/^#?([a-fA-F0-9]{6})$/';

        if (!preg_match($pattern, $value)) {
            $fail('The :attribute must be a valid hexadecimal color code.');
        }
    }
}
