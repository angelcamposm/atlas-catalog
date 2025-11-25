<?php

declare(strict_types=1);

namespace Tests\Unit\Rules;

use App\Rules\RgbColorRule;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(RgbColorRule::class)]
class RgbColorRuleTest extends TestCase
{
    /**
     * Provides valid RGB color strings for testing.
     *
     * @return array<string, array<string>>
     */
    public static function validRgbColors(): array
    {
        return [
            'black' => ['rgb(0, 0, 0)'],
            'white' => ['rgb(255, 255, 255)'],
            'red' => ['rgb(255, 0, 0)'],
            'green' => ['rgb(0, 255, 0)'],
            'blue' => ['rgb(0, 0, 255)'],
            'with spaces' => ['rgb(10, 20, 30)'],
        ];
    }

    /**
     * Provides invalid color strings for testing.
     *
     * @return array<string, array<mixed>>
     */
    public static function invalidColors(): array
    {
        return [
            'out of range' => ['rgb(256, 0, 0)'],
            'negative value' => ['rgb(-10, 0, 0)'],
            'wrong format' => ['255, 0, 0'],
            'missing closing parenthesis' => ['rgb(0, 0, 0'],
            'not a string' => [123],
            'null value' => [null],
            'empty string' => [''],
        ];
    }

    #[Test]
    #[DataProvider('validRgbColors')]
    public function it_passes_with_valid_rgb_colors(string $color): void
    {
        $rule = new RgbColorRule();
        $validationFailed = false;

        $rule->validate('color', $color, function () use (&$validationFailed) {
            $validationFailed = true;
        });

        $this->assertFalse($validationFailed, "Validation failed for a valid color: {$color}");
    }

    #[Test]
    #[DataProvider('invalidColors')]
    public function it_fails_with_invalid_colors(mixed $color): void
    {
        $rule = new RgbColorRule();
        $validationFailed = false;

        $rule->validate('color', $color, function () use (&$validationFailed) {
            $validationFailed = true;
        });

        $this->assertTrue($validationFailed, 'Validation passed for an invalid color.');
    }
}
