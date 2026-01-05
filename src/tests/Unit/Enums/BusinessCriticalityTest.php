<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\BusinessCriticality;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(BusinessCriticality::class)]
class BusinessCriticalityTest extends TestCase
{
    #[Test]
    public function it_has_correct_values(): void
    {
        $this->assertEquals('mission_critical', BusinessCriticality::MissionCritical->value);
        $this->assertEquals('business_critical', BusinessCriticality::BusinessCritical->value);
        $this->assertEquals('business_operational', BusinessCriticality::BusinessOperational->value);
        $this->assertEquals('administrative', BusinessCriticality::Administrative->value);
    }

    #[Test]
    public function it_has_display_names(): void
    {
        $this->assertEquals('Mission Critical', BusinessCriticality::MissionCritical->displayName());
        $this->assertEquals('Business Critical', BusinessCriticality::BusinessCritical->displayName());
        $this->assertEquals('Business Operational', BusinessCriticality::BusinessOperational->displayName());
        $this->assertEquals('Administrative', BusinessCriticality::Administrative->displayName());
    }

    #[Test]
    public function it_has_descriptions(): void
    {
        $this->assertNotEmpty(BusinessCriticality::MissionCritical->description());
        $this->assertNotEmpty(BusinessCriticality::BusinessCritical->description());
        $this->assertNotEmpty(BusinessCriticality::BusinessOperational->description());
        $this->assertNotEmpty(BusinessCriticality::Administrative->description());
    }
}
