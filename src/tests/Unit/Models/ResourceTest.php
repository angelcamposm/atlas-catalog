<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Resource::class)]
class ResourceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $resource = Resource::factory()->create();
        $this->assertInstanceOf(Resource::class, $resource);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $resource = Resource::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($resource->hasCreator());
        $this->assertInstanceOf(User::class, $resource->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $resource = Resource::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($resource->hasUpdater());
        $this->assertInstanceOf(User::class, $resource->updater);
    }

    #[Test]
    public function it_belongs_to_a_type(): void
    {
        $category = ResourceCategory::factory()->create();
        $resource = Resource::factory()->create(['category_id' => $category->id]);
        $this->assertInstanceOf(ResourceCategory::class, $resource->category);
        $this->assertEquals($category->id, $resource->category->id);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Resource',
            'category_id' => ResourceCategory::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $resource = new Resource($data);

        $this->assertEquals($data, $resource->getAttributes());
    }
}
