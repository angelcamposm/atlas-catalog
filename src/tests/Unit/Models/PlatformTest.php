<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Component;
use App\Models\Platform;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Platform::class)]
class PlatformTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $platform = Platform::factory()->create();
        $this->assertInstanceOf(Platform::class, $platform);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $platform = Platform::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($platform->hasCreator());
        $this->assertInstanceOf(User::class, $platform->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $platform = Platform::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($platform->hasUpdater());
        $this->assertInstanceOf(User::class, $platform->updater);
    }

    #[Test]
    public function it_has_components(): void
    {
        $platform = Platform::factory()->create();
        Component::factory()->count(3)->create(['platform_id' => $platform->id]);

        $this->assertInstanceOf(Collection::class, $platform->components);
        $this->assertCount(3, $platform->components);
        $this->assertInstanceOf(Component::class, $platform->components->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Platform',
            'description' => 'Test Description',
            'icon' => 'icon.png',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $platform = new Platform($data);

        $this->assertEquals($data, $platform->getAttributes());
    }
}
