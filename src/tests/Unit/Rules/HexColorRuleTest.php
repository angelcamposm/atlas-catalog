<?php

declare(strict_types=1);

namespace Tests\Unit\Rules;

use App\Rules\HexColorRule;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(HexColorRule::class)]
class HexColorRuleTest extends TestCase
{
    /**
     * Provides valid hex color strings for testing.
     *
     * @return array<string, array<string>>
     */
    public static function validHexColors(): array
    {
        return [
            'long form with hash' => ['#ff0000'],
            'short form with hash' => ['#f00'],
            'long form without hash' => ['aabbcc'],
            'short form without hash' => ['abc'],
        ];
    }

    /**
     * Provides invalid color strings for testing.
     *
     * @return array<string, array<mixed>>
     */
    public static function invalidHexColors(): array
    {
        return [
            'invalid length' => ['#12345'],
            'invalid characters' => ['#ggg'],
            'not a color' => ['not a color'],
            'not a string' => [123456],
            'null value' => [null],
            'empty string' => [''],
        ];
    }

    #[Test]
    #[DataProvider('validHexColors')]
    public function it_passes_with_valid_hex_colors(string $color): void
    {
        $rule = new HexColorRule();
        $validationFailed = false;

        $rule->validate('color', $color, function () use (&$validationFailed) {
            $validationFailed = true;
        });

        $this->assertFalse($validationFailed, "Validation failed for a valid color: {$color}");
    }

    #[Test]
    #[DataProvider('invalidHexColors')]
    public function it_fails_with_invalid_hex_colors(mixed $color): void
    {
        $rule = new HexColorRule();
        $validationFailed = false;

        $rule->validate('color', $color, function () use (&$validationFailed) {
            $validationFailed = true;
        });

        $this->assertTrue($validationFailed, 'Validation passed for an invalid color.');
    }

    #[Test]
    public function it_fails_short_hex_colors_when_disallowed(): void
    {
        $rule = new HexColorRule(allowShort: false);
        $validationFailed = false;

        $rule->validate('color', '#f00', function () use (&$validationFailed) {
            $validationFailed = true;
        });

        $this->assertTrue($validationFailed, 'Validation passed for a short hex color when it should have failed.');
    }

    #[Test]
    public function it_passes_long_hex_colors_when_short_is_disallowed(): void
    {
        $rule = new HexColorRule(allowShort: false);
        $validationFailed = false;

        $rule->validate('color', '#ff0000', function () use (&$validationFailed) {
            $validationFailed = true;
        });

        $this->assertFalse($validationFailed, 'Validation failed for a long hex color.');
    }
}
