<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Entity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Entity::class)]
class EntityTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $entity = Entity::factory()->create();
        $this->assertInstanceOf(Entity::class, $entity);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $entity = Entity::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($entity->hasCreator());
        $this->assertInstanceOf(User::class, $entity->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $entity = Entity::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($entity->hasUpdater());
        $this->assertInstanceOf(User::class, $entity->updater);
    }

    #[Test]
    public function it_can_be_enabled(): void
    {
        $entity = Entity::factory()->create(['is_enabled' => true]);
        $this->assertTrue($entity->is_enabled);
    }

    #[Test]
    public function it_can_be_disabled(): void
    {
        $entity = Entity::factory()->create(['is_enabled' => false]);
        $this->assertFalse($entity->is_enabled);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Entity',
            'description' => 'This is a test entity.',
            'is_aggregate' => true,
            'is_aggregate_root' => false,
            'is_enabled' => true,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $entity = new Entity($data);

        $this->assertEquals($data, $entity->getAttributes());
    }
}
