<?php

declare(strict_types=1);

namespace Tests\Unit\Observers;

use App\Models\ServiceAccount;
use App\Models\ServiceAccountToken;
use App\Models\User;
use App\Observers\ServiceAccountTokenObserver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ServiceAccountTokenObserver::class)]
class ServiceAccountTokenObserverTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Auth::login($this->user);
    }

    #[Test]
    public function it_fills_created_by_with_authenticated_user_id_on_creation(): void
    {
        $model = ServiceAccountToken::factory()
            ->for(ServiceAccount::factory(), 'serviceAccount')
            ->create();

        $this->assertNotNull($model->created_by);
        $this->assertEquals($this->user->id, $model->created_by);
    }

    #[Test]
    public function test_updating_sets_updated_by(): void
    {
        $model = ServiceAccountToken::factory()
            ->for(ServiceAccount::factory(), 'serviceAccount')
            ->create();

        $this->assertNull($model->updated_by);

        $user = User::factory()->create();
        Auth::login($user);

        $model->token = bcrypt(fake()->text(250));
        $model->save();

        $this->assertNotNull($model->updated_by);
        $this->assertEquals($user->id, $model->updated_by);
    }

    #[Test]
    public function test_creating_does_not_overwrite_created_by(): void
    {
        $user2 = User::factory()->create();

        $model = ServiceAccountToken::factory()
            ->for(ServiceAccount::factory(), 'serviceAccount')
            ->create(['created_by' => $user2->id]);

        $this->assertEquals($user2->id, $model->created_by);
    }
}
