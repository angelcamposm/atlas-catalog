<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Category::class)]
class CategoryTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $category = Category::factory()->create();
        $this->assertInstanceOf(Category::class, $category);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($category->hasCreator());
        $this->assertInstanceOf(User::class, $category->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($category->hasUpdater());
        $this->assertInstanceOf(User::class, $category->updater);
    }

    #[Test]
    public function it_has_a_parent(): void
    {
        $parent = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => $parent->id]);

        $this->assertInstanceOf(Category::class, $child->parent);
        $this->assertTrue($child->hasParent());
        $this->assertEquals($parent->id, $child->parent->id);
    }

    #[Test]
    public function it_can_have_a_null_parent(): void
    {
        $category = Category::factory()->create(['parent_id' => null]);
        $this->assertNull($category->parent);
    }

    #[Test]
    public function it_has_children(): void
    {
        $parent = Category::factory()->create();
        Category::factory()->count(3)->create(['parent_id' => $parent->id]);

        $this->assertInstanceOf(Collection::class, $parent->children);
        $this->assertCount(3, $parent->children);
        $this->assertInstanceOf(Category::class, $parent->children->first());
    }

    #[Test]
    public function it_can_have_no_children(): void
    {
        $category = Category::factory()->create();
        $this->assertInstanceOf(Collection::class, $category->children);
        $this->assertCount(0, $category->children);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Category',
            'description' => 'Test Description',
            'icon' => 'icon.png',
            'model' => 'App\Models\Test',
            'parent_id' => Category::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $category = new Category($data);

        $this->assertEquals($data, $category->getAttributes());
    }
}
