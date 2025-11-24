<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Api;
use App\Models\ApiStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ApiStatus::class)]
class ApiStatusTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $status = ApiStatus::factory()->create();
        $this->assertInstanceOf(ApiStatus::class, $status);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $status = ApiStatus::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($status->hasCreator());
        $this->assertInstanceOf(User::class, $status->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $status = ApiStatus::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($status->hasUpdater());
        $this->assertInstanceOf(User::class, $status->updater);
    }

    #[Test]
    public function it_has_many_apis(): void
    {
        $status = ApiStatus::factory()
            ->has(Api::factory()->count(3), 'apis')
            ->create();

        $this->assertInstanceOf(Collection::class, $status->apis);
        $this->assertCount(3, $status->apis);
        $this->assertInstanceOf(Api::class, $status->apis->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Status',
            'description' => 'This is a test status.',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $status = new ApiStatus($data);

        $this->assertEquals($data, $status->getAttributes());
    }
}
