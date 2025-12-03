<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\Color;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Color::class)]
class ColorTest extends TestCase
{
    #[Test]
    public function it_has_correct_values(): void
    {
        $this->assertEquals('aliceblue', Color::Aliceblue->value);
        $this->assertEquals('antiquewhite', Color::Antiquewhite->value);
        $this->assertEquals('aqua', Color::Aqua->value);
        $this->assertEquals('black', Color::Black->value);
        $this->assertEquals('blue', Color::Blue->value);
        $this->assertEquals('red', Color::Red->value);
        $this->assertEquals('white', Color::White->value);
        $this->assertEquals('yellow', Color::Yellow->value);
    }

    #[Test]
    public function it_can_be_instantiated(): void
    {
        $this->assertInstanceOf(Color::class, Color::Aliceblue);
    }

    #[Test]
    public function it_returns_all_cases(): void
    {
        $this->assertIsArray(Color::cases());
        $this->assertNotEmpty(Color::cases());
    }
}
