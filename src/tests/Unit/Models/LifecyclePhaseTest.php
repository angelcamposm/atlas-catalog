<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Component;
use App\Models\LifecyclePhase;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(LifecyclePhase::class)]
class LifecyclePhaseTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $phase = LifecyclePhase::factory()->create();
        $this->assertInstanceOf(LifecyclePhase::class, $phase);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $phase = LifecyclePhase::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($phase->hasCreator());
        $this->assertInstanceOf(User::class, $phase->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $phase = LifecyclePhase::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($phase->hasUpdater());
        $this->assertInstanceOf(User::class, $phase->updater);
    }

    #[Test]
    public function it_has_components(): void
    {
        $phase = LifecyclePhase::factory()->create();
        $component = Component::factory()->create();
        $phase->components()->attach($component);

        $this->assertInstanceOf(Collection::class, $phase->components);
        $this->assertCount(1, $phase->components);
        $this->assertInstanceOf(Component::class, $phase->components->first());
    }

    #[Test]
    public function it_can_require_approval(): void
    {
        $phase = LifecyclePhase::factory()->create(['approval_required' => true]);
        $this->assertTrue($phase->needsApproval());
    }

    #[Test]
    public function it_can_not_require_approval(): void
    {
        $phase = LifecyclePhase::factory()->create(['approval_required' => false]);
        $this->assertFalse($phase->needsApproval());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'approval_required' => true,
            'color' => 'red',
            'description' => 'Test Description',
            'name' => 'Test Phase',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $phase = new LifecyclePhase($data);

        $this->assertEquals($data, $phase->getAttributes());
    }
}
