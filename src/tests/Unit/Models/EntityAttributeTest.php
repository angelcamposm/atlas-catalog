<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Entity;
use App\Models\EntityAttribute;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(EntityAttribute::class)]
class EntityAttributeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $attribute = EntityAttribute::factory()->withEntity()->create();
        $this->assertInstanceOf(EntityAttribute::class, $attribute);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $attribute = EntityAttribute::factory()->withEntity()->create(['created_by' => $user->id]);
        $this->assertTrue($attribute->hasCreator());
        $this->assertInstanceOf(User::class, $attribute->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $attribute = EntityAttribute::factory()->withEntity()->create(['updated_by' => $user->id]);
        $this->assertTrue($attribute->hasUpdater());
        $this->assertInstanceOf(User::class, $attribute->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'entity_id' => Entity::factory()->create()->id,
            'name' => 'Test Attribute',
            'description' => 'Test Description',
            'type' => 'string',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $attribute = new EntityAttribute($data);

        $this->assertEquals($data, $attribute->getAttributes());
    }
}
