<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Link;
use App\Models\LinkCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(LinkCategory::class)]
class LinkCategoryTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $category = LinkCategory::factory()->create();
        $this->assertInstanceOf(LinkCategory::class, $category);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $category = LinkCategory::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($category->hasCreator());
        $this->assertInstanceOf(User::class, $category->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $category = LinkCategory::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($category->hasUpdater());
        $this->assertInstanceOf(User::class, $category->updater);
    }

    #[Test]
    public function it_has_links(): void
    {
        $category = LinkCategory::factory()->create();
        Link::factory()->count(3)->create(['category_id' => $category->id]);

        $this->assertInstanceOf(Collection::class, $category->links);
        $this->assertCount(3, $category->links);
        $this->assertInstanceOf(Link::class, $category->links->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Category',
            'description' => 'Test Description',
            'icon' => 'icon.png',
            'model' => 'link',
            'parent_id' => LinkCategory::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $category = new LinkCategory($data);

        $this->assertEquals($data, $category->getAttributes());
    }
}
