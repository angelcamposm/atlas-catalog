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

#[CoversClass(GroupType::class)]
class GroupTypeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $groupType = GroupType::factory()->create();
        $this->assertInstanceOf(GroupType::class, $groupType);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $groupType = GroupType::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($groupType->hasCreator());
        $this->assertInstanceOf(User::class, $groupType->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $groupType = GroupType::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($groupType->hasUpdater());
        $this->assertInstanceOf(User::class, $groupType->updater);
    }

    #[Test]
    public function it_has_groups(): void
    {
        $groupType = GroupType::factory()->create();
        Group::factory()->count(3)->create(['type_id' => $groupType->id]);

        $this->assertInstanceOf(Collection::class, $groupType->groups);
        $this->assertCount(3, $groupType->groups);
        $this->assertInstanceOf(Group::class, $groupType->groups->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Group Type',
            'description' => 'Test Description',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $groupType = new GroupType($data);

        $this->assertEquals($data, $groupType->getAttributes());
    }
}
