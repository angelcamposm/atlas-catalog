<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Component;
use App\Models\ServiceStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ServiceStatus::class)]
class ServiceStatusTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $status = ServiceStatus::factory()->create();
        $this->assertInstanceOf(ServiceStatus::class, $status);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $status = ServiceStatus::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($status->hasCreator());
        $this->assertInstanceOf(User::class, $status->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $status = ServiceStatus::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($status->hasUpdater());
        $this->assertInstanceOf(User::class, $status->updater);
    }

    #[Test]
    public function it_has_components(): void
    {
        $status = ServiceStatus::factory()->create();
        Component::factory()->count(3)->create(['status_id' => $status->id]);

        $this->assertInstanceOf(Collection::class, $status->components);
        $this->assertCount(3, $status->components);
        $this->assertInstanceOf(Component::class, $status->components->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Status',
            'allow_deployments' => true,
            'description' => 'Test Description',
            'icon' => 'icon.png',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $status = new ServiceStatus($data);

        $this->assertEquals($data, $status->getAttributes());
    }
}
