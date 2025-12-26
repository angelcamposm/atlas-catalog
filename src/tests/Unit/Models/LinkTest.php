<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Link;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Link::class)]
class LinkTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $link = Link::factory()->create();
        $this->assertInstanceOf(Link::class, $link);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $link = Link::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($link->hasCreator());
        $this->assertInstanceOf(User::class, $link->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $link = Link::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($link->hasUpdater());
        $this->assertInstanceOf(User::class, $link->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Link',
            'description' => 'Test Description',
            'model_name' => 'App\Models\System',
            'model_id' => 1,
            'url' => 'https://example.com',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $link = new Link($data);

        $this->assertEquals($data, $link->getAttributes());
    }
}
