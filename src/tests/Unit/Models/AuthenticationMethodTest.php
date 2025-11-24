<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Api;
use App\Models\AuthenticationMethod;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(AuthenticationMethod::class)]
class AuthenticationMethodTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $method = AuthenticationMethod::factory()->create();
        $this->assertInstanceOf(AuthenticationMethod::class, $method);
    }

    #[Test]
    public function it_has_many_apis(): void
    {
        $method = AuthenticationMethod::factory()
            ->has(Api::factory()->count(3), 'apis')
            ->create();

        $this->assertInstanceOf(Collection::class, $method->apis);
        $this->assertCount(3, $method->apis);
        $this->assertInstanceOf(Api::class, $method->apis->first());
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $method = AuthenticationMethod::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($method->hasCreator());
        $this->assertInstanceOf(User::class, $method->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $method = AuthenticationMethod::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($method->hasUpdater());
        $this->assertInstanceOf(User::class, $method->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Method',
            'description' => 'This is a test method.',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $method = new AuthenticationMethod($data);

        $this->assertEquals($data, $method->getAttributes());
    }
}
