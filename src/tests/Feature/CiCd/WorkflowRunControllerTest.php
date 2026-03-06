<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

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
    #[Test]
    public function test_list_workflow_runs_returns_paginated_results(): void
    {
        WorkflowRun::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/ci-cd/workflow-runs');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'status', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_create_workflow_run_as_editor(): void
    {
        $data = [
            'name' => 'Build Pipeline Run',
            'description' => 'Automated build and test run',
            'status' => 'pending',
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/ci-cd/workflow-runs', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Build Pipeline Run');

        $this->assertDatabaseHas('workflow_runs', ['name' => 'Build Pipeline Run']);
    }

    #[Test]
    public function test_create_workflow_run_requires_authentication(): void
    {
        $data = ['name' => 'Test Run'];

        $response = $this->postJson('/api/v1/ci-cd/workflow-runs', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_workflow_run_by_id(): void
    {
        $run = WorkflowRun::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/ci-cd/workflow-runs/{$run->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $run->id);
    }

    #[Test]
    public function test_update_workflow_run_as_editor(): void
    {
        $run = WorkflowRun::factory()->create();

        $data = [
            'status' => 'success',
            'description' => 'Successfully completed',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/ci-cd/workflow-runs/{$run->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.status', 'success');

        $this->assertDatabaseHas('workflow_runs', [
            'id' => $run->id,
            'status' => 'success',
        ]);
    }

    #[Test]
    public function test_delete_workflow_run_as_admin_only(): void
    {
        $run = WorkflowRun::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/ci-cd/workflow-runs/{$run->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/ci-cd/workflow-runs/{$run->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('workflow_runs', ['id' => $run->id]);
    }

    #[Test]
    public function test_show_nonexistent_workflow_run_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/ci-cd/workflow-runs/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_workflow_run_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/ci-cd/workflow-runs', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_workflow_run(): void
    {
        $data = ['name' => 'Test Run'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/ci-cd/workflow-runs', $data);

        $response->assertForbidden();
    }
}
