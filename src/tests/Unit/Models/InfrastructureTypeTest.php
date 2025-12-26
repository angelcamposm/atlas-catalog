<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Cluster;
use App\Models\InfrastructureType;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(InfrastructureType::class)]
class InfrastructureTypeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $type = InfrastructureType::factory()->create();
        $this->assertInstanceOf(InfrastructureType::class, $type);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $type = InfrastructureType::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($type->hasCreator());
        $this->assertInstanceOf(User::class, $type->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $type = InfrastructureType::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($type->hasUpdater());
        $this->assertInstanceOf(User::class, $type->updater);
    }

    #[Test]
    public function it_has_clusters(): void
    {
        $type = InfrastructureType::factory()->create();
        Cluster::factory()->count(3)->create(['infrastructure_type_id' => $type->id]);

        $this->assertInstanceOf(Collection::class, $type->clusters);
        $this->assertCount(3, $type->clusters);
        $this->assertInstanceOf(Cluster::class, $type->clusters->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Type',
            'description' => 'Test Description',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $type = new InfrastructureType($data);

        $this->assertEquals($data, $type->getAttributes());
    }
}
