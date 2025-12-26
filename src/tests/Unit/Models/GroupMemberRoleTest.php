<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\GroupMemberRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(GroupMemberRole::class)]
class GroupMemberRoleTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $role = GroupMemberRole::factory()->create();
        $this->assertInstanceOf(GroupMemberRole::class, $role);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $role = GroupMemberRole::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($role->hasCreator());
        $this->assertInstanceOf(User::class, $role->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $role = GroupMemberRole::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($role->hasUpdater());
        $this->assertInstanceOf(User::class, $role->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Role',
            'description' => 'Test Description',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $role = new GroupMemberRole($data);

        $this->assertEquals($data, $role->getAttributes());
    }
}
