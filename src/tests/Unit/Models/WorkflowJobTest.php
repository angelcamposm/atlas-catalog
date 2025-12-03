<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Component;
use App\Models\User;
use App\Models\WorkflowJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(WorkflowJob::class)]
class WorkflowJobTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $job = WorkflowJob::factory()->create();
        $this->assertInstanceOf(WorkflowJob::class, $job);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $job = WorkflowJob::factory()->create(['created_by' => $user->id]);
        $this->assertInstanceOf(User::class, $job->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $job = WorkflowJob::factory()->create(['updated_by' => $user->id]);
        $this->assertInstanceOf(User::class, $job->updater);
    }

    #[Test]
    public function it_belongs_to_a_component(): void
    {
        $component = Component::factory()->create();
        $job = WorkflowJob::factory()->create(['component_id' => $component->id]);
        $this->assertInstanceOf(Component::class, $job->component);
    }

    #[Test]
    public function it_can_be_enabled(): void
    {
        $job = WorkflowJob::factory()->create(['is_enabled' => true]);
        $this->assertTrue($job->isEnabled());
    }

    #[Test]
    public function it_can_be_disabled(): void
    {
        $job = WorkflowJob::factory()->create(['is_enabled' => false]);
        $this->assertFalse($job->isEnabled());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Job',
            'component_id' => Component::factory()->create()->id,
            'display_name' => 'Test Job Display',
            'description' => 'This is a test job.',
            'discovery_source' => 'manual',
            'is_enabled' => true,
            'url' => 'https://example.com',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $job = new WorkflowJob($data);

        $this->assertEquals($data, $job->getAttributes());
    }

    #[Test]
    public function it_is_not_fillable(): void
    {
        $data = [
            'id' => 1,
            'name' => 'Test Job',
        ];

        $job = new WorkflowJob($data);

        $this->assertNotEquals($data, $job->getAttributes());
        $this->assertNull($job->getAttribute('id'));
    }
}
