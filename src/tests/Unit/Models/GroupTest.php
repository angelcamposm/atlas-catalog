<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Group;
use App\Models\GroupType;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Group::class)]
class GroupTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $group = Group::factory()->create();
        $this->assertInstanceOf(Group::class, $group);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($group->hasCreator());
        $this->assertInstanceOf(User::class, $group->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($group->hasUpdater());
        $this->assertInstanceOf(User::class, $group->updater);
    }

    #[Test]
    public function it_belongs_to_a_type(): void
    {
        $type = GroupType::factory()->create();
        $group = Group::factory()->create(['type_id' => $type->id]);
        $this->assertInstanceOf(GroupType::class, $group->type);
        $this->assertEquals($type->id, $group->type->id);
    }

    #[Test]
    public function it_has_members(): void
    {
        $group = Group::factory()->create();
        $user = User::factory()->create();
        $group->members()->attach($user);

        $this->assertInstanceOf(Collection::class, $group->members);
        $this->assertCount(1, $group->members);
        $this->assertInstanceOf(User::class, $group->members->first());
        $this->assertTrue($group->hasMembers());
    }

    #[Test]
    public function it_can_have_no_members(): void
    {
        $group = Group::factory()->create();
        $this->assertInstanceOf(Collection::class, $group->members);
        $this->assertCount(0, $group->members);
        $this->assertFalse($group->hasMembers());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Group',
            'description' => 'Test Description',
            'email' => 'group@example.com',
            'icon' => 'icon.png',
            'label' => 'Test Label',
            'parent_id' => Group::factory()->create()->id,
            'type_id' => GroupType::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $group = new Group($data);

        $this->assertEquals($data, $group->getAttributes());
    }
}
