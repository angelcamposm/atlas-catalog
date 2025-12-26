<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Cluster;
use App\Models\ClusterType;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ClusterType::class)]
class ClusterTypeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $clusterType = ClusterType::factory()->create();
        $this->assertInstanceOf(ClusterType::class, $clusterType);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $clusterType = ClusterType::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($clusterType->hasCreator());
        $this->assertInstanceOf(User::class, $clusterType->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $clusterType = ClusterType::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($clusterType->hasUpdater());
        $this->assertInstanceOf(User::class, $clusterType->updater);
    }

    #[Test]
    public function it_belongs_to_a_vendor(): void
    {
        $vendor = Vendor::factory()->create();
        $clusterType = ClusterType::factory()->create(['vendor_id' => $vendor->id]);
        $this->assertInstanceOf(Vendor::class, $clusterType->vendor);
        $this->assertEquals($vendor->id, $clusterType->vendor->id);
    }

    #[Test]
    public function it_has_clusters(): void
    {
        $clusterType = ClusterType::factory()->create();
        Cluster::factory()->count(3)->create(['type_id' => $clusterType->id]);

        $this->assertInstanceOf(Collection::class, $clusterType->cluster);
        $this->assertCount(3, $clusterType->cluster);
        $this->assertInstanceOf(Cluster::class, $clusterType->cluster->first());
    }

    #[Test]
    public function it_can_be_enabled(): void
    {
        $clusterType = ClusterType::factory()->create(['is_enabled' => true]);
        $this->assertTrue($clusterType->isEnabled());
    }

    #[Test]
    public function it_can_be_disabled(): void
    {
        $clusterType = ClusterType::factory()->create(['is_enabled' => false]);
        $this->assertFalse($clusterType->isEnabled());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Cluster Type',
            'icon' => 'icon.png',
            'is_enabled' => true,
            'vendor_id' => Vendor::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $clusterType = new ClusterType($data);

        $this->assertEquals($data, $clusterType->getAttributes());
    }
}
