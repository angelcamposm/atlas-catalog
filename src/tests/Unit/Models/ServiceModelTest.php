<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\ServiceModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ServiceModel::class)]
class ServiceModelTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $serviceModel = ServiceModel::factory()->create();
        $this->assertInstanceOf(ServiceModel::class, $serviceModel);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $serviceModel = ServiceModel::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($serviceModel->hasCreator());
        $this->assertInstanceOf(User::class, $serviceModel->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $serviceModel = ServiceModel::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($serviceModel->hasUpdater());
        $this->assertInstanceOf(User::class, $serviceModel->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Service Model',
            'slug' => 'test-service-model',
            'abbrv' => 'TSM',
            'display_name' => 'Test Service Model',
            'description' => 'Test Description',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $serviceModel = new ServiceModel($data);

        $this->assertEquals($data, $serviceModel->getAttributes());
    }
}
