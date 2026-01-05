<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ResourceCategory::class)]
class ResourceCategoryTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $category = ResourceCategory::factory()->create();
        $this->assertInstanceOf(ResourceCategory::class, $category);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $category = ResourceCategory::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($category->hasCreator());
        $this->assertInstanceOf(User::class, $category->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $category = ResourceCategory::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($category->hasUpdater());
        $this->assertInstanceOf(User::class, $category->updater);
    }

    #[Test]
    public function it_has_resources(): void
    {
        $category = ResourceCategory::factory()->create();
        Resource::factory()->count(3)->create(['category_id' => $category->id]);

        $this->assertInstanceOf(Collection::class, $category->resources);
        $this->assertCount(3, $category->resources);
        $this->assertInstanceOf(Resource::class, $category->resources->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Category',
            'description' => 'Test Description',
            'icon' => 'icon.png',
            'model' => 'resource',
            'parent_id' => ResourceCategory::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $category = new ResourceCategory($data);

        $this->assertEquals($data, $category->getAttributes());
    }
}
