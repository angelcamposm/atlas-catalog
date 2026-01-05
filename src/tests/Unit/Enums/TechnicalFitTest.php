<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\TechnicalFit;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(TechnicalFit::class)]
class TechnicalFitTest extends TestCase
{
    #[Test]
    public function it_has_correct_values(): void
    {
        $this->assertEquals('excellent', TechnicalFit::Excellent->value);
        $this->assertEquals('adequate', TechnicalFit::Adequate->value);
        $this->assertEquals('poor', TechnicalFit::Poor->value);
        $this->assertEquals('unacceptable', TechnicalFit::Unacceptable->value);
    }

    #[Test]
    public function it_has_display_names(): void
    {
        $this->assertEquals('Excellent', TechnicalFit::Excellent->displayName());
        $this->assertEquals('Adequate', TechnicalFit::Adequate->displayName());
        $this->assertEquals('Poor', TechnicalFit::Poor->displayName());
        $this->assertEquals('Unacceptable', TechnicalFit::Unacceptable->displayName());
    }

    #[Test]
    public function it_has_descriptions(): void
    {
        $this->assertNotEmpty(TechnicalFit::Excellent->description());
        $this->assertNotEmpty(TechnicalFit::Adequate->description());
        $this->assertNotEmpty(TechnicalFit::Poor->description());
        $this->assertNotEmpty(TechnicalFit::Unacceptable->description());
    }
}
