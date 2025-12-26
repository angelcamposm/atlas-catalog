<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Api;
use App\Models\BusinessDomain;
use App\Models\BusinessTier;
use App\Models\Component;
use App\Models\Entity;
use App\Models\Group;
use App\Models\LifecyclePhase;
use App\Models\Platform;
use App\Models\ServiceStatus;
use App\Models\System;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Component::class)]
class ComponentTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $component = Component::factory()->create();
        $this->assertInstanceOf(Component::class, $component);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $component = Component::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($component->hasCreator());
        $this->assertInstanceOf(User::class, $component->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $component = Component::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($component->hasUpdater());
        $this->assertInstanceOf(User::class, $component->updater);
    }

    #[Test]
    public function it_belongs_to_a_domain(): void
    {
        $domain = BusinessDomain::factory()->create();
        $component = Component::factory()->create(['domain_id' => $domain->id]);
        $this->assertInstanceOf(BusinessDomain::class, $component->domain);
        $this->assertEquals($domain->id, $component->domain->id);
    }

    #[Test]
    public function it_belongs_to_an_owner(): void
    {
        $owner = Group::factory()->create();
        $component = Component::factory()->create(['owner_id' => $owner->id]);
        $this->assertInstanceOf(Group::class, $component->owner);
        $this->assertEquals($owner->id, $component->owner->id);
    }

    #[Test]
    public function it_belongs_to_a_platform(): void
    {
        $platform = Platform::factory()->create();
        $component = Component::factory()->create(['platform_id' => $platform->id]);
        $this->assertInstanceOf(Platform::class, $component->platform);
        $this->assertEquals($platform->id, $component->platform->id);
    }

    #[Test]
    public function it_belongs_to_a_tier(): void
    {
        $tier = BusinessTier::factory()->create();
        $component = Component::factory()->create(['tier_id' => $tier->id]);
        $this->assertInstanceOf(BusinessTier::class, $component->tier);
        $this->assertEquals($tier->id, $component->tier->id);
    }

    #[Test]
    public function it_belongs_to_a_status(): void
    {
        $status = ServiceStatus::factory()->create();
        $component = Component::factory()->create(['status_id' => $status->id]);
        $this->assertInstanceOf(ServiceStatus::class, $component->status);
        $this->assertEquals($status->id, $component->status->id);
    }

    #[Test]
    public function it_has_apis(): void
    {
        $component = Component::factory()->create();
        $api = Api::factory()->create();
        $component->apis()->attach($api);

        $this->assertInstanceOf(Collection::class, $component->apis);
        $this->assertCount(1, $component->apis);
        $this->assertInstanceOf(Api::class, $component->apis->first());
    }

    #[Test]
    public function it_has_entities(): void
    {
        $component = Component::factory()->create();
        $entity = Entity::factory()->create();
        $component->entities()->attach($entity);

        $this->assertInstanceOf(Collection::class, $component->entities);
        $this->assertCount(1, $component->entities);
        $this->assertInstanceOf(Entity::class, $component->entities->first());
    }

    #[Test]
    public function it_has_lifecycle_phases(): void
    {
        $component = Component::factory()->create();
        $phase = LifecyclePhase::factory()->create();
        $component->lifecyclePhases()->attach($phase);

        $this->assertInstanceOf(Collection::class, $component->lifecyclePhases);
        $this->assertCount(1, $component->lifecyclePhases);
        $this->assertInstanceOf(LifecyclePhase::class, $component->lifecyclePhases->first());
    }

    #[Test]
    public function it_has_systems(): void
    {
        $component = Component::factory()->create();
        $system = System::factory()->create();
        $component->systems()->attach($system);

        $this->assertInstanceOf(Collection::class, $component->systems);
        $this->assertCount(1, $component->systems);
        $this->assertInstanceOf(System::class, $component->systems->first());
        $this->assertTrue($component->hasSystems());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Component',
            'description' => 'Test Description',
            'discovery_source' => 'manual',
            'display_name' => 'Test Component',
            'domain_id' => BusinessDomain::factory()->create()->id,
            'is_exposed' => true,
            'is_stateless' => true,
            'lifecycle_id' => LifecyclePhase::factory()->create()->id,
            'owner_id' => Group::factory()->create()->id,
            'platform_id' => Platform::factory()->create()->id,
            'slug' => 'test-component',
            'tags' => 'tag1,tag2',
            'tier_id' => BusinessTier::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $component = new Component($data);

        $this->assertEquals($data, $component->getAttributes());
    }
}
