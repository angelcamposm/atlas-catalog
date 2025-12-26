<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(User::class)]
class UserTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $user = User::factory()->create();
        $this->assertInstanceOf(User::class, $user);
    }

    #[Test]
    public function it_has_groups(): void
    {
        $user = User::factory()->create();
        $group = Group::factory()->create();
        $user->groups()->attach($group);

        $this->assertInstanceOf(Collection::class, $user->groups);
        $this->assertCount(1, $user->groups);
        $this->assertInstanceOf(Group::class, $user->groups->first());
        $this->assertTrue($user->hasGroups());
    }

    #[Test]
    public function it_can_have_no_groups(): void
    {
        $user = User::factory()->create();
        $this->assertInstanceOf(Collection::class, $user->groups);
        $this->assertCount(0, $user->groups);
        $this->assertFalse($user->hasGroups());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ];

        $user = new User($data);

        $this->assertEquals($data['name'], $user->name);
        $this->assertEquals($data['email'], $user->email);
    }
}
