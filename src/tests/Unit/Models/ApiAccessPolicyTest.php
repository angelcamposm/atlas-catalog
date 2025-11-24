<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\ApiAccessPolicy;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ApiAccessPolicy::class)]
class ApiAccessPolicyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $policy = ApiAccessPolicy::factory()->create();
        $this->assertInstanceOf(ApiAccessPolicy::class, $policy);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $policy = ApiAccessPolicy::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($policy->hasCreator());
        $this->assertInstanceOf(User::class, $policy->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $policy = ApiAccessPolicy::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($policy->hasUpdater());
        $this->assertInstanceOf(User::class, $policy->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Policy',
            'description' => 'This is a test policy.',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $policy = new ApiAccessPolicy($data);

        $this->assertEquals($data, $policy->getAttributes());
    }
}
