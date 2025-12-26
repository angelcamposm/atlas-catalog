<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\FunctionalFit;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(FunctionalFit::class)]
class FunctionalFitTest extends TestCase
{
    #[Test]
    public function it_has_correct_values(): void
    {
        $this->assertEquals('perfect', FunctionalFit::Perfect->value);
        $this->assertEquals('appropriate', FunctionalFit::Appropriate->value);
        $this->assertEquals('insufficient', FunctionalFit::Insufficient->value);
        $this->assertEquals('unreasonable', FunctionalFit::Unreasonable->value);
    }

    #[Test]
    public function it_has_display_names(): void
    {
        $this->assertEquals('Perfect', FunctionalFit::Perfect->displayName());
        $this->assertEquals('Appropriate', FunctionalFit::Appropriate->displayName());
        $this->assertEquals('Insufficient', FunctionalFit::Insufficient->displayName());
        $this->assertEquals('Unreasonable', FunctionalFit::Unreasonable->displayName());
    }

    #[Test]
    public function it_has_descriptions(): void
    {
        $this->assertNotEmpty(FunctionalFit::Perfect->description());
        $this->assertNotEmpty(FunctionalFit::Appropriate->description());
        $this->assertNotEmpty(FunctionalFit::Insufficient->description());
        $this->assertNotEmpty(FunctionalFit::Unreasonable->description());
    }
}
