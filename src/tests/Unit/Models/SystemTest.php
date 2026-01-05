<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\BusinessCapability;
use App\Models\Component;
use App\Models\Group;
use App\Models\System;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(System::class)]
class SystemTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $system = System::factory()->create();
        $this->assertInstanceOf(System::class, $system);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $system = System::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($system->hasCreator());
        $this->assertInstanceOf(User::class, $system->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $system = System::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($system->hasUpdater());
        $this->assertInstanceOf(User::class, $system->updater);
    }

    #[Test]
    public function it_belongs_to_an_owner(): void
    {
        $owner = Group::factory()->create();
        $system = System::factory()->create(['owner_id' => $owner->id]);
        $this->assertInstanceOf(Group::class, $system->owner);
        $this->assertEquals($owner->id, $system->owner->id);
    }

    #[Test]
    public function it_has_components(): void
    {
        $system = System::factory()->create();
        $component = Component::factory()->create();
        $system->components()->attach($component);

        $this->assertInstanceOf(Collection::class, $system->components);
        $this->assertCount(1, $system->components);
        $this->assertInstanceOf(Component::class, $system->components->first());
        $this->assertTrue($system->hasComponents());
    }

    #[Test]
    public function it_has_business_capabilities(): void
    {
        $system = System::factory()->create();
        $capability = BusinessCapability::factory()->create();
        $system->businessCapabilities()->attach($capability);

        $this->assertInstanceOf(Collection::class, $system->businessCapabilities);
        $this->assertCount(1, $system->businessCapabilities);
        $this->assertInstanceOf(BusinessCapability::class, $system->businessCapabilities->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test System',
            'display_name' => 'Test System',
            'description' => 'Test Description',
            'owner_id' => Group::factory()->create()->id,
            'tags' => 'tag1,tag2',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $system = new System($data);

        $this->assertEquals($data, $system->getAttributes());
    }
}
