<?php

declare(strict_types=1);

namespace Tests\Unit\Observers;

use App\Models\ServiceModel;
use App\Models\User;
use App\Observers\ServiceModelObserver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ServiceModelObserver::class)]
class ServiceModelObserverTest extends TestCase
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
        $model = ServiceModel::factory()->create();

        $this->assertNotNull($model->created_by);
        $this->assertEquals($this->user->id, $model->created_by);
    }

    #[Test]
    public function test_updating_sets_updated_by(): void
    {
        $model = ServiceModel::factory()->create();

        $user = User::factory()->create();
        Auth::login($user);

        $model->display_name = fake()->name();
        $model->save();

        $this->assertEquals($user->id, $model->updated_by);
    }

    #[Test]
    public function test_creating_does_not_overwrite_created_by(): void
    {
        $user2 = User::factory()->create();

        $model = ServiceModel::factory()->create(['created_by' => $user2->id]);

        $this->assertEquals($user2->id, $model->created_by);
    }
}
