<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Vendor::class)]
class VendorTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $vendor = Vendor::factory()->create();
        $this->assertInstanceOf(Vendor::class, $vendor);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $vendor = Vendor::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($vendor->hasCreator());
        $this->assertInstanceOf(User::class, $vendor->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $vendor = Vendor::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($vendor->hasUpdater());
        $this->assertInstanceOf(User::class, $vendor->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Vendor',
            'icon' => 'icon.png',
            'url' => 'https://example.com',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $vendor = new Vendor($data);

        $this->assertEquals($data, $vendor->getAttributes());
    }
}
