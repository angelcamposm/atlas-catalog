<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Enums\WorkflowRunResult;
use App\Models\User;
use App\Models\WorkflowJob;
use App\Models\WorkflowRun;
use App\Models\WorkflowRunCommit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(WorkflowRun::class)]
class WorkflowRunTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $workflowRun = WorkflowRun::factory()->create();
        $this->assertInstanceOf(WorkflowRun::class, $workflowRun);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $workflowRun = WorkflowRun::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($workflowRun->hasCreator());
        $this->assertInstanceOf(User::class, $workflowRun->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $workflowRun = WorkflowRun::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($workflowRun->hasUpdater());
        $this->assertInstanceOf(User::class, $workflowRun->updater);
    }

    #[Test]
    public function it_belongs_to_a_workflow_job(): void
    {
        $job = WorkflowJob::factory()->create();
        $workflowRun = WorkflowRun::factory()->create(['workflow_job_id' => $job->id]);
        $this->assertInstanceOf(WorkflowJob::class, $workflowRun->workflowJob);
        $this->assertEquals($job->id, $workflowRun->workflowJob->id);
    }

    #[Test]
    public function it_has_one_commit(): void
    {
        $workflowRun = WorkflowRun::factory()->create();
        $commit = WorkflowRunCommit::factory()->create(['workflow_run_id' => $workflowRun->id]);
        $this->assertInstanceOf(WorkflowRunCommit::class, $workflowRun->commit);
        $this->assertEquals($commit->id, $workflowRun->commit->id);
    }

    #[Test]
    public function it_casts_started_at_to_datetime(): void
    {
        $workflowRun = WorkflowRun::factory()->create(['started_at' => now()]);
        $this->assertInstanceOf(Carbon::class, $workflowRun->started_at);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'workflow_job_id' => WorkflowJob::factory()->create()->id,
            'description' => 'Test Description',
            'display_name' => 'Test Run',
            'duration_milliseconds' => '1000',
            'is_enabled' => true,
            'result' => WorkflowRunResult::Success->value,
            'url' => 'https://example.com',
            'started_at' => now()->toDateTimeString(),
            'started_by' => User::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $workflowRun = new WorkflowRun($data);

        $this->assertEquals($data, $workflowRun->toArray());
    }
}
