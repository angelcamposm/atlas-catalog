<?php

declare(strict_types=1);

namespace Tests\Unit\Rules;

use App\Rules\NamedColorRule;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(NamedColorRule::class)]
class NamedColorRuleTest extends TestCase
{
    /**
     * Provides valid named colors for testing.
     *
     * @return array<string, array<string>>
     */
    public static function validColors(): array
    {
        return [
            'red' => ['red'],
            'blue' => ['blue'],
            'ALICEBLUE' => ['ALICEBLUE'], // Test case insensitivity
            'darkgreen' => ['darkgreen'],
        ];
    }

    /**
     * Provides invalid data for testing.
     *
     * @return array<string, array<mixed>>
     */
    public static function invalidColors(): array
    {
        return [
            'non-existent color' => ['not-a-real-color'],
            'hex code' => ['#ff0000'],
            'rgb string' => ['rgb(255, 0, 0)'],
            'not a string' => [123],
            'null value' => [null],
            'empty string' => [''],
        ];
    }

    #[Test]
    #[DataProvider('validColors')]
    public function it_passes_with_valid_named_colors(string $color): void
    {
        $rule = new NamedColorRule();
        $validationFailed = false;

        $rule->validate('color', $color, function () use (&$validationFailed) {
            $validationFailed = true;
        });

        $this->assertFalse($validationFailed, "Validation failed for a valid color: {$color}");
    }

    #[Test]
    #[DataProvider('invalidColors')]
    public function it_fails_with_invalid_data(mixed $color): void
    {
        $rule = new NamedColorRule();
        $validationFailed = false;

        $rule->validate('color', $color, function () use (&$validationFailed) {
            $validationFailed = true;
        });

        $this->assertTrue($validationFailed, 'Validation passed for an invalid color.');
    }
}
