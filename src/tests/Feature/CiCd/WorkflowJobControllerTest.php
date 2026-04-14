<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

use App\Models\Component;
use App\Models\WorkflowJob;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for WorkflowJobController.
 *
 * Tests CRUD operations for WorkflowJob resources.
 *
 * The route is a nested resource: workflows.jobs
 * URL pattern: /api/v1/ci-cd/workflows/{workflow}/jobs[/{job}]
 * The {workflow} segment is treated as a domain prefix; the controller
 * resolves only the {job} binding. Any integer is accepted for {workflow}.
 */
class WorkflowJobControllerTest extends ApiTestCase
{
    /** Base URL for the nested resource. Any value for {workflow} is accepted. */
    private const JOBS_ENDPOINT = '/api/v1/ci-cd/workflows/1/jobs';

    private const DISCOVERY_SOURCE = 'Pipeline';

    #[Test]
    public function test_list_workflow_jobs_returns_paginated_results(): void
    {
        WorkflowJob::factory()->count(5)->create();

        $response = $this->actingAsEditor()
            ->getJson(self::JOBS_ENDPOINT);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'component_id', 'display_name', 'is_enabled', 'url'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(5, 'data');
    }

    #[Test]
    public function test_create_workflow_job_as_editor(): void
    {
        $component = Component::factory()->create();

        $data = [
            'name'             => 'build-and-test',
            'component_id'     => $component->id,
            'display_name'     => 'Build and Test',
            'description'      => 'Runs the full build and test pipeline',
            'discovery_source' => self::DISCOVERY_SOURCE,
            'is_enabled'       => true,
            'url'              => 'https://ci.example.com/jobs/build-and-test',
        ];

        $response = $this->actingAsEditor()
            ->postJson(self::JOBS_ENDPOINT, $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'build-and-test')
            ->assertJsonPath('data.display_name', 'Build and Test');

        $this->assertDatabaseHas('workflow_jobs', ['name' => 'build-and-test']);
    }

    #[Test]
    public function test_create_workflow_job_requires_authentication(): void
    {
        $response = $this->postJson(self::JOBS_ENDPOINT, ['name' => 'test-job']);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_workflow_job_by_id(): void
    {
        $job = WorkflowJob::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson(self::JOBS_ENDPOINT."/{$job->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $job->id);
    }

    #[Test]
    public function test_delete_workflow_job_as_authenticated_user(): void
    {
        $job = WorkflowJob::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson(self::JOBS_ENDPOINT."/{$job->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('workflow_jobs', ['id' => $job->id]);
    }

    #[Test]
    public function test_show_nonexistent_workflow_job_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson(self::JOBS_ENDPOINT.'/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_workflow_job_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson(self::JOBS_ENDPOINT, []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'component_id',
                'discovery_source',
                'is_enabled',
            ]);
    }

    #[Test]
    public function test_create_workflow_job_rejects_invalid_discovery_source(): void
    {
        $component = Component::factory()->create();

        $data = [
            'name'             => 'test-job',
            'component_id'     => $component->id,
            'discovery_source' => 'INVALID_SOURCE',
            'is_enabled'       => true,
            'url'              => 'https://ci.example.com/jobs/test',
        ];

        $response = $this->actingAsEditor()
            ->postJson(self::JOBS_ENDPOINT, $data);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['discovery_source']);
    }

    #[Test]
    public function test_create_workflow_job_denies_viewer(): void
    {
        $component = Component::factory()->create();

        $data = [
            'name'             => 'viewer-created-job',
            'component_id'     => $component->id,
            'discovery_source' => 'Manual',
            'is_enabled'       => false,
            'url'              => 'https://ci.example.com/jobs/viewer-job',
        ];

        $response = $this->actingAsViewer()
            ->postJson(self::JOBS_ENDPOINT, $data);

        $response->assertForbidden();
    }
}
