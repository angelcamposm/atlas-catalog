<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

use App\Models\WorkflowRunCommit;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for WorkflowRunCommitController.
 *
 * Tests read-only operations (index, show) for WorkflowRunCommit resources.
 * Write operations are not tested as no store/update/delete routes are registered.
 */
class WorkflowRunCommitControllerTest extends ApiTestCase
{
    private const COMMITS_ENDPOINT = '/api/v1/ci-cd/workflows/commits';

    #[Test]
    public function test_list_workflow_run_commits_returns_paginated_results(): void
    {
        WorkflowRunCommit::factory()->withWorkflowRun()->count(3)->create();

        $response = $this->actingAsEditor()
            ->getJson(self::COMMITS_ENDPOINT);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'workflow_run_id', 'author_name', 'author_email', 'commit_sha', 'commit_message'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(3, 'data');
    }

    #[Test]
    public function test_list_workflow_run_commits_requires_authentication(): void
    {
        $response = $this->getJson(self::COMMITS_ENDPOINT);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_viewer_can_list_workflow_run_commits(): void
    {
        WorkflowRunCommit::factory()->withWorkflowRun()->count(2)->create();

        $response = $this->actingAsViewer()
            ->getJson(self::COMMITS_ENDPOINT);

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    #[Test]
    public function test_show_workflow_run_commit_by_id(): void
    {
        $commit = WorkflowRunCommit::factory()->withWorkflowRun()->create();

        $response = $this->actingAsEditor()
            ->getJson(self::COMMITS_ENDPOINT."/{$commit->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $commit->id)
            ->assertJsonPath('data.commit_sha', $commit->commit_sha)
            ->assertJsonPath('data.author_email', $commit->author_email);
    }

    #[Test]
    public function test_show_workflow_run_commit_requires_authentication(): void
    {
        $commit = WorkflowRunCommit::factory()->withWorkflowRun()->create();

        $response = $this->getJson(self::COMMITS_ENDPOINT."/{$commit->id}");

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_returns_404_for_nonexistent_workflow_run_commit(): void
    {
        $response = $this->actingAsEditor()
            ->getJson(self::COMMITS_ENDPOINT.'/99999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_viewer_can_show_workflow_run_commit(): void
    {
        $commit = WorkflowRunCommit::factory()->withWorkflowRun()->create();

        $response = $this->actingAsViewer()
            ->getJson(self::COMMITS_ENDPOINT."/{$commit->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $commit->id);
    }
}
