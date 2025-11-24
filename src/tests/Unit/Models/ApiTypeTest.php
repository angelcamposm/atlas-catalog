<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Api;
use App\Models\ApiType;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ApiType::class)]
class ApiTypeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $type = ApiType::factory()->create();
        $this->assertInstanceOf(ApiType::class, $type);
    }

    #[Test]
    public function it_has_many_apis(): void
    {
        $type = ApiType::factory()
            ->has(Api::factory()->count(3), 'apis')
            ->create();

        $this->assertInstanceOf(Collection::class, $type->apis);
        $this->assertCount(3, $type->apis);
        $this->assertInstanceOf(Api::class, $type->apis->first());
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $type = ApiType::factory()->create(['created_by' => $user->id]);
        $this->assertInstanceOf(User::class, $type->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $type = ApiType::factory()->create(['updated_by' => $user->id]);
        $this->assertInstanceOf(User::class, $type->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Type',
            'description' => 'This is a test type.',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $type = new ApiType($data);

        $this->assertEquals($data, $type->getAttributes());
    }
}
