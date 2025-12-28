<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Cluster;
use App\Models\ClusterType;
use App\Models\InfrastructureType;
use App\Models\LifecyclePhase;
use App\Models\Node;
use App\Models\ServiceAccount;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Cluster::class)]
class ClusterTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $cluster = Cluster::factory()->create();
        $this->assertInstanceOf(Cluster::class, $cluster);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $cluster = Cluster::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($cluster->hasCreator());
        $this->assertInstanceOf(User::class, $cluster->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $cluster = Cluster::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($cluster->hasUpdater());
        $this->assertInstanceOf(User::class, $cluster->updater);
    }

    #[Test]
    public function it_belongs_to_an_infrastructure_type(): void
    {
        $cluster = Cluster::factory()->create([
            'infrastructure_type_id' => InfrastructureType::factory()->create()->id
        ]);
        $this->assertInstanceOf(InfrastructureType::class, $cluster->infrastructureType);
    }

    #[Test]
    public function it_can_have_a_null_infrastructure_type(): void
    {
        $cluster = Cluster::factory()->create(['infrastructure_type_id' => null]);
        $this->assertNull($cluster->infrastructureType);
    }

    #[Test]
    public function it_belongs_to_a_lifecycle(): void
    {
        $cluster = Cluster::factory()->create([
            'lifecycle_id' => LifecyclePhase::factory()->create()->id,
        ]);
        $this->assertInstanceOf(LifecyclePhase::class, $cluster->lifecycle);
    }

    #[Test]
    public function it_can_have_a_null_lifecycle(): void
    {
        $cluster = Cluster::factory()->create(['lifecycle_id' => null]);
        $this->assertNull($cluster->lifecycle);
    }

    #[Test]
    public function it_belongs_to_a_type(): void
    {
        $cluster = Cluster::factory()->create([
            'type_id' => ClusterType::factory()->create()->id
        ]);
        $this->assertInstanceOf(ClusterType::class, $cluster->type);
    }

    #[Test]
    public function it_can_have_a_null_type(): void
    {
        $cluster = Cluster::factory()->create(['type_id' => null]);
        $this->assertNull($cluster->type);
    }

    #[Test]
    public function it_has_many_nodes(): void
    {
        $cluster = Cluster::factory()
            ->has(Node::factory()->count(3), 'nodes')
            ->create();

        $this->assertInstanceOf(Collection::class, $cluster->nodes);
        $this->assertCount(3, $cluster->nodes);
        $this->assertInstanceOf(Node::class, $cluster->nodes->first());
    }

    #[Test]
    public function it_can_have_no_nodes(): void
    {
        $cluster = Cluster::factory()->create();
        $this->assertInstanceOf(Collection::class, $cluster->nodes);
        $this->assertCount(0, $cluster->nodes);
    }

    #[Test]
    public function it_has_many_service_accounts(): void
    {
        $cluster = Cluster::factory()
            ->has(ServiceAccount::factory()->count(2), 'serviceAccounts')
            ->create();

        // Access the relationship property, not the method, to get the Collection
        $this->assertInstanceOf(Collection::class, $cluster->serviceAccounts);
        $this->assertCount(2, $cluster->serviceAccounts);
        $this->assertInstanceOf(ServiceAccount::class, $cluster->serviceAccounts->first());
    }

    #[Test]
    public function it_can_have_no_service_accounts(): void
    {
        $cluster = Cluster::factory()->create();

        // Access the relationship property, not the method, to get the Collection
        $this->assertInstanceOf(Collection::class, $cluster->serviceAccounts);
        $this->assertCount(0, $cluster->serviceAccounts);
    }

    #[Test]
    public function it_can_have_licensing(): void
    {
        $cluster = Cluster::factory()->create(['has_licensing' => true]);
        $this->assertTrue($cluster->hasLicensing());
    }

    #[Test]
    public function it_can_not_have_licensing(): void
    {
        $cluster = Cluster::factory()->create(['has_licensing' => false]);
        $this->assertFalse($cluster->hasLicensing());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Cluster',
            'api_url' => 'https://example.com',
            'cluster_uuid' => 'abc-123',
            'display_name' => 'Test Cluster Display',
            'full_version' => '1.2.3-full',
            'has_licensing' => true,
            'infrastructure_type_id' => InfrastructureType::factory()->create()->id,
            'licensing_model' => 'premium',
            'lifecycle_id' => LifecyclePhase::factory()->create()->id,
            'tags' => 'tag1,tag2',
            'timezone' => 'UTC',
            'version' => '1.2.3',
            'url' => 'https://cluster.example.com',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $cluster = new Cluster($data);

        $this->assertEquals($data, $cluster->getAttributes());
    }

    #[Test]
    public function it_is_not_fillable(): void
    {
        $data = [
            'id' => 1,
            'name' => 'Test Cluster',
        ];

        $cluster = new Cluster($data);

        $this->assertNotEquals($data, $cluster->getAttributes());
        $this->assertNull($cluster->getAttribute('id'));
    }
}
