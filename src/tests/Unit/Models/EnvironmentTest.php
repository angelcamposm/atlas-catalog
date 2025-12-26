<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Environment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Environment::class)]
class EnvironmentTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $environment = Environment::factory()->create();
        $this->assertInstanceOf(Environment::class, $environment);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $environment = Environment::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($environment->hasCreator());
        $this->assertInstanceOf(User::class, $environment->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $environment = Environment::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($environment->hasUpdater());
        $this->assertInstanceOf(User::class, $environment->updater);
    }

    #[Test]
    public function it_can_have_an_owner(): void
    {
        $user = User::factory()->create();
        $environment = Environment::factory()->create(['owner_id' => $user->id]);
        $this->assertTrue($environment->hasOwner());
    }

    #[Test]
    public function it_can_have_no_owner(): void
    {
        $environment = Environment::factory()->create(['owner_id' => null]);
        $this->assertFalse($environment->hasOwner());
    }

    #[Test]
    public function it_can_require_approval(): void
    {
        $environment = Environment::factory()->create(['approval_required' => true]);
        $this->assertTrue($environment->needsApproval());
    }

    #[Test]
    public function it_can_not_require_approval(): void
    {
        $environment = Environment::factory()->create(['approval_required' => false]);
        $this->assertFalse($environment->needsApproval());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Environment',
            'abbr' => 'TE',
            'approval_required' => true,
            'description' => 'Test Description',
            'display_in_matrix' => true,
            'display_name' => 'Test Environment',
            'is_production_environment' => false,
            'owner_id' => User::factory()->create()->id,
            'prefix' => 'te',
            'sort_order' => 1,
            'suffix' => 'v1',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $environment = new Environment($data);

        $this->assertEquals($data, $environment->getAttributes());
    }
}
