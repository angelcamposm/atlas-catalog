<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

use App\Models\WorkflowJob;
use App\Models\WorkflowRun;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for WorkflowRunController.
 *
 * Tests CRUD operations for WorkflowRun resources.
 */
class WorkflowRunControllerTest extends ApiTestCase
{
    private const WORKFLOW_RUNS_ENDPOINT = '/api/v1/ci-cd/workflows/runs';

    private const BUILD_PIPELINE_RUN = 'Build Pipeline Run';

    #[Test]
    public function test_list_workflow_runs_returns_paginated_results(): void
    {
        WorkflowRun::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson(self::WORKFLOW_RUNS_ENDPOINT);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'workflow_job_id', 'display_name', 'result', 'started_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_create_workflow_run_as_editor(): void
    {
        $workflowJob = WorkflowJob::factory()->create();

        $data = [
            'workflow_job_id' => $workflowJob->id,
            'description' => 'Automated build and test run',
            'display_name' => self::BUILD_PIPELINE_RUN,
            'duration_milliseconds' => 5000,
            'is_enabled' => true,
            'result' => 'SUCCESS',
            'started_at' => '2026-03-07 12:00:00',
        ];

        $response = $this->actingAsEditor()
            ->postJson(self::WORKFLOW_RUNS_ENDPOINT, $data);

        $response->assertCreated()
            ->assertJsonPath('data.display_name', self::BUILD_PIPELINE_RUN)
            ->assertJsonPath('data.result', 'SUCCESS');

        $this->assertDatabaseHas('workflow_runs', ['display_name' => self::BUILD_PIPELINE_RUN]);
    }

    #[Test]
    public function test_create_workflow_run_requires_authentication(): void
    {
        $data = ['display_name' => 'Test Run'];

        $response = $this->postJson(self::WORKFLOW_RUNS_ENDPOINT, $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_workflow_run_by_id(): void
    {
        $run = WorkflowRun::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson(self::WORKFLOW_RUNS_ENDPOINT."/{$run->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $run->id);
    }

    #[Test]
    public function test_update_workflow_run_as_editor(): void
    {
        $run = WorkflowRun::factory()->create();

        $data = [
            'result' => 'SUCCESS',
            'description' => 'Successfully completed',
        ];

        $response = $this->actingAsEditor()
            ->putJson(self::WORKFLOW_RUNS_ENDPOINT."/{$run->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.result', 'SUCCESS');

        $this->assertDatabaseHas('workflow_runs', [
            'id' => $run->id,
            'result' => 'SUCCESS',
        ]);
    }

    #[Test]
    public function test_delete_workflow_run_as_authenticated_user(): void
    {
        $run = WorkflowRun::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson(self::WORKFLOW_RUNS_ENDPOINT."/{$run->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('workflow_runs', ['id' => $run->id]);
    }

    #[Test]
    public function test_show_nonexistent_workflow_run_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson(self::WORKFLOW_RUNS_ENDPOINT.'/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_workflow_run_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson(self::WORKFLOW_RUNS_ENDPOINT, []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'workflow_job_id',
                'description',
                'display_name',
                'duration_milliseconds',
                'is_enabled',
                'result',
                'started_at',
            ]);
    }

    #[Test]
    public function test_create_workflow_run_denies_viewer(): void
    {
        $workflowJob = WorkflowJob::factory()->create();

        $data = [
            'workflow_job_id' => $workflowJob->id,
            'description' => 'Viewer initiated run',
            'display_name' => 'Viewer Run',
            'duration_milliseconds' => 1000,
            'is_enabled' => true,
            'result' => 'FAILURE',
            'started_at' => '2026-03-07 12:01:00',
        ];

        $response = $this->actingAsViewer()
            ->postJson(self::WORKFLOW_RUNS_ENDPOINT, $data);

        $response->assertForbidden();
    }
}
