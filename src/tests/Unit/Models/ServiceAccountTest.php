<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Cluster;
use App\Models\ServiceAccount;
use App\Models\ServiceAccountToken;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ServiceAccount::class)]
class ServiceAccountTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $serviceAccount = ServiceAccount::factory()->create();
        $this->assertInstanceOf(ServiceAccount::class, $serviceAccount);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $serviceAccount = ServiceAccount::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($serviceAccount->hasCreator());
        $this->assertInstanceOf(User::class, $serviceAccount->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $serviceAccount = ServiceAccount::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($serviceAccount->hasUpdater());
        $this->assertInstanceOf(User::class, $serviceAccount->updater);
    }

    #[Test]
    public function it_has_clusters(): void
    {
        $serviceAccount = ServiceAccount::factory()->create();
        $cluster = Cluster::factory()->create();
        $serviceAccount->cluster()->attach($cluster);

        $this->assertInstanceOf(Collection::class, $serviceAccount->cluster);
        $this->assertCount(1, $serviceAccount->cluster);
        $this->assertInstanceOf(Cluster::class, $serviceAccount->cluster->first());
    }

    #[Test]
    public function it_has_tokens(): void
    {
        $serviceAccount = ServiceAccount::factory()->create();
        ServiceAccountToken::factory()->count(3)->create(['service_account_id' => $serviceAccount->id]);

        $this->assertInstanceOf(Collection::class, $serviceAccount->tokens);
        $this->assertCount(3, $serviceAccount->tokens);
        $this->assertInstanceOf(ServiceAccountToken::class, $serviceAccount->tokens->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Service Account',
            'namespace' => 'default',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $serviceAccount = new ServiceAccount($data);

        $this->assertEquals($data, $serviceAccount->getAttributes());
    }
}
