<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\BusinessTier;
use App\Models\Component;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(BusinessTier::class)]
class BusinessTierTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $tier = BusinessTier::factory()->create();
        $this->assertInstanceOf(BusinessTier::class, $tier);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $tier = BusinessTier::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($tier->hasCreator());
        $this->assertInstanceOf(User::class, $tier->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $tier = BusinessTier::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($tier->hasUpdater());
        $this->assertInstanceOf(User::class, $tier->updater);
    }

    #[Test]
    public function it_has_components(): void
    {
        $tier = BusinessTier::factory()->create();
        Component::factory()->count(3)->create(['tier_id' => $tier->id]);

        $this->assertInstanceOf(Collection::class, $tier->components);
        $this->assertCount(3, $tier->components);
        $this->assertInstanceOf(Component::class, $tier->components->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'code' => 'T1',
            'description' => 'Test Description',
            'name' => 'Tier 1',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $tier = new BusinessTier($data);

        $this->assertEquals($data, $tier->getAttributes());
    }
}
