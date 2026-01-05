<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\ApiAccessPolicy;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ApiAccessPolicy::class)]
class ApiAccessPolicyTest extends TestCase
{
    #[Test]
    public function it_has_correct_values(): void
    {
        $this->assertEquals(1, ApiAccessPolicy::PublicApi->value);
        $this->assertEquals(2, ApiAccessPolicy::InternalApi->value);
        $this->assertEquals(3, ApiAccessPolicy::PartnerApi->value);
        $this->assertEquals(4, ApiAccessPolicy::CompositeApi->value);
    }

    #[Test]
    public function it_has_display_names(): void
    {
        $this->assertEquals('Public API', ApiAccessPolicy::PublicApi->displayName());
        $this->assertEquals('Internal API', ApiAccessPolicy::InternalApi->displayName());
        $this->assertEquals('Partner API', ApiAccessPolicy::PartnerApi->displayName());
        $this->assertEquals('Composite API', ApiAccessPolicy::CompositeApi->displayName());
    }

    #[Test]
    public function it_has_descriptions(): void
    {
        $this->assertNotEmpty(ApiAccessPolicy::PublicApi->description());
        $this->assertNotEmpty(ApiAccessPolicy::InternalApi->description());
        $this->assertNotEmpty(ApiAccessPolicy::PartnerApi->description());
        $this->assertNotEmpty(ApiAccessPolicy::CompositeApi->description());
    }
}
