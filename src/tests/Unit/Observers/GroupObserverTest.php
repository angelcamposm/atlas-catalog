<?php

declare(strict_types=1);

namespace Tests\Unit\Observers;

use App\Models\User;
use App\Observers\GroupObserver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use App\Models\Group;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Class GroupObserverTest
 *
 * Verifies that model observers automatically populate audit fields.
 */
#[CoversClass(GroupObserver::class)]
class GroupObserverTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_fills_created_by_with_authenticated_user_id_on_creation(): void
    {
        $user = User::factory()->create();
        Auth::login($user);

        $group = new Group();
        $group->name = 'Test Group';
        $group->description = 'Test Description';
        $group->save();

        $this->assertEquals($user->id, $group->created_by);
    }

    #[Test]
    public function it_fills_updated_by_with_authenticated_user_id_on_update(): void
    {
        $user = User::factory()->create();
        Auth::login($user);

        $group = Group::factory()->create();

        // Perform update
        $group->name = 'Updated Name';
        $group->save();

        $this->assertEquals($user->id, $group->updated_by);
    }
}
