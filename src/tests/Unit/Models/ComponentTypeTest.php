<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\ComponentType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ComponentType::class)]
class ComponentTypeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $componentType = ComponentType::factory()->create();
        $this->assertInstanceOf(ComponentType::class, $componentType);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $componentType = ComponentType::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($componentType->hasCreator());
        $this->assertInstanceOf(User::class, $componentType->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $componentType = ComponentType::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($componentType->hasUpdater());
        $this->assertInstanceOf(User::class, $componentType->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Component Type',
            'description' => 'Test Description',
            'icon' => 'icon.png',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $componentType = new ComponentType($data);

        $this->assertEquals($data, $componentType->getAttributes());
    }
}
