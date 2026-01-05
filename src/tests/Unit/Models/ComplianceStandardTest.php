<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\ComplianceStandard;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ComplianceStandard::class)]
class ComplianceStandardTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $standard = ComplianceStandard::factory()->create();
        $this->assertInstanceOf(ComplianceStandard::class, $standard);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $standard = ComplianceStandard::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($standard->hasCreator());
        $this->assertInstanceOf(User::class, $standard->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $standard = ComplianceStandard::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($standard->hasUpdater());
        $this->assertInstanceOf(User::class, $standard->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Standard',
            'country_code' => 'US',
            'description' => 'Test Description',
            'display_name' => 'Test Standard',
            'focus_area' => 'Security',
            'industry' => 'Tech',
            'url' => 'https://example.com',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $standard = new ComplianceStandard($data);

        $this->assertEquals($data, $standard->getAttributes());
    }
}
