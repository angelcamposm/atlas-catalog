<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Api;
use App\Models\ApiCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ApiCategory::class)]
class ApiCategoryTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $category = ApiCategory::factory()->create();
        $this->assertInstanceOf(ApiCategory::class, $category);
    }

    #[Test]
    public function it_has_many_apis(): void
    {
        $category = ApiCategory::factory()
            ->has(Api::factory()->count(3), 'apis')
            ->create();

        $this->assertInstanceOf(Collection::class, $category->apis);
        $this->assertCount(3, $category->apis);
        $this->assertInstanceOf(Api::class, $category->apis->first());
    }

    #[Test]
    public function it_can_have_no_apis(): void
    {
        $category = ApiCategory::factory()->create();
        $this->assertInstanceOf(Collection::class, $category->apis);
        $this->assertCount(0, $category->apis);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $category = ApiCategory::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($category->hasCreator());
        $this->assertInstanceOf(User::class, $category->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $category = ApiCategory::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($category->hasUpdater());
        $this->assertInstanceOf(User::class, $category->updater);
    }

    #[Test]
    public function it_has_a_parent(): void
    {
        $parent = ApiCategory::factory()->create();
        $child = ApiCategory::factory()->create(['parent_id' => $parent->id]);

        $this->assertInstanceOf(ApiCategory::class, $child->parent);
        $this->assertEquals($parent->id, $child->parent->id);
    }

    #[Test]
    public function it_can_have_a_null_parent(): void
    {
        $category = ApiCategory::factory()->create(['parent_id' => null]);
        $this->assertNull($category->parent);
    }

    #[Test]
    public function it_has_children(): void
    {
        $parent = ApiCategory::factory()->create();
        ApiCategory::factory()->count(3)->create(['parent_id' => $parent->id]);

        $this->assertInstanceOf(Collection::class, $parent->children);
        $this->assertCount(3, $parent->children);
        $this->assertInstanceOf(ApiCategory::class, $parent->children->first());
    }

    #[Test]
    public function it_can_have_no_children(): void
    {
        $category = ApiCategory::factory()->create();
        $this->assertInstanceOf(Collection::class, $category->children);
        $this->assertCount(0, $category->children);
    }

    #[Test]
    public function it_hides_model_attribute_on_serialization(): void
    {
        $category = ApiCategory::factory()->create();
        $array = $category->toArray();

        $this->assertArrayNotHasKey('model', $array);
    }

    #[Test]
    public function it_applies_global_scope_for_model(): void
    {
        ApiCategory::factory()->create();

        $category = ApiCategory::first();

        $this->assertEquals('api', $category->model);
    }

    #[Test]
    public function it_is_not_fillable(): void
    {
        $data = [
            'id' => 1,
            'name' => 'Test Category',
        ];

        $category = new ApiCategory($data);

        $this->assertNotEquals($data, $category->getAttributes());
        $this->assertNull($category->getAttribute('id'));
    }
}
