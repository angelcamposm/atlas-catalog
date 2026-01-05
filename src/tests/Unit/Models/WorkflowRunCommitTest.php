<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\WorkflowRun;
use App\Models\WorkflowRunCommit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(WorkflowRunCommit::class)]
class WorkflowRunCommitTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $commit = WorkflowRunCommit::factory()->withWorkflowRun()->create();
        $this->assertInstanceOf(WorkflowRunCommit::class, $commit);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $commit = WorkflowRunCommit::factory()->withWorkflowRun()->create(['created_by' => $user->id]);
        $this->assertTrue($commit->hasCreator());
        $this->assertInstanceOf(User::class, $commit->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $commit = WorkflowRunCommit::factory()->withWorkflowRun()->create(['updated_by' => $user->id]);
        $this->assertTrue($commit->hasUpdater());
        $this->assertInstanceOf(User::class, $commit->updater);
    }

    #[Test]
    public function it_belongs_to_a_workflow_run(): void
    {
        $run = WorkflowRun::factory()->create();
        $commit = WorkflowRunCommit::factory()->create(['workflow_run_id' => $run->id]);
        $this->assertInstanceOf(WorkflowRun::class, $commit->workflowRun);
        $this->assertEquals($run->id, $commit->workflowRun->id);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'author_email' => 'test@example.com',
            'author_name' => 'Test Author',
            'commit_date' => now()->toDateTimeString(),
            'commit_message' => 'Test Commit',
            'commit_sha' => 'sha123',
            'ref_name' => 'main',
            'repo_url' => 'https://github.com/test/repo',
            'workflow_run_id' => WorkflowRun::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $commit = new WorkflowRunCommit($data);

        $this->assertEquals($data, $commit->getAttributes());
    }
}
