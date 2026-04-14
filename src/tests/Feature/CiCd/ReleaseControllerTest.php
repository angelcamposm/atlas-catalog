<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

use App\Models\Component;
use App\Models\Release;
use App\Models\WorkflowRun;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ReleaseController.
 *
 * Tests CRUD operations for Release resources.
 */
class ReleaseControllerTest extends ApiTestCase
{
    private const RELEASES_ENDPOINT = '/api/v1/ci-cd/releases';

    #[Test]
    public function test_list_releases_returns_paginated_results(): void
    {
        Release::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson(self::RELEASES_ENDPOINT);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'version', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_create_release_as_editor(): void
    {
        $component = Component::factory()->create();
        $workflowRun = WorkflowRun::factory()->create([
            'workflow_job_id' =>
                \App\Models\WorkflowJob::factory()->create(['component_id' => $component->id])->id,
        ]);

        $data = [
            'component_id' => $component->id,
            'workflow_run_id' => $workflowRun->id,
            'version' => 'v1.0.0',
            'status' => 'published',
            'changelog' => 'First production release',
        ];

        $response = $this->actingAsEditor()
            ->postJson(self::RELEASES_ENDPOINT, $data);

        $response->assertCreated()
            ->assertJsonPath('data.version', 'v1.0.0')
            ->assertJsonPath('data.status', 'published')
            ->assertJsonPath('data.changelog', 'First production release');

        $this->assertDatabaseHas('releases', ['version' => 'v1.0.0']);
    }

    #[Test]
    public function test_create_release_requires_authentication(): void
    {
        $data = ['version' => 'v1.0.0'];

        $response = $this->postJson(self::RELEASES_ENDPOINT, $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_release_by_id(): void
    {
        $release = Release::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson(self::RELEASES_ENDPOINT."/{$release->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $release->id);
    }

    #[Test]
    public function test_update_release_as_editor(): void
    {
        $release = Release::factory()->create();

        $data = [
            'version' => 'v1.0.1',
            'status' => 'published',
            'changelog' => 'Patch release',
        ];

        $response = $this->actingAsEditor()
            ->putJson(self::RELEASES_ENDPOINT."/{$release->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.version', 'v1.0.1')
            ->assertJsonPath('data.status', 'published')
            ->assertJsonPath('data.changelog', 'Patch release');

        $this->assertDatabaseHas('releases', [
            'id' => $release->id,
            'version' => 'v1.0.1',
        ]);
    }

    #[Test]
    public function test_delete_release_as_admin_only(): void
    {
        $release = Release::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson(self::RELEASES_ENDPOINT."/{$release->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('releases', ['id' => $release->id]);
    }

    #[Test]
    public function test_show_nonexistent_release_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson(self::RELEASES_ENDPOINT.'/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_release_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson(self::RELEASES_ENDPOINT, []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['component_id', 'version', 'status']);
    }

    #[Test]
    public function test_create_release_denies_viewer(): void
    {
        $component = Component::factory()->create();

        $data = [
            'component_id' => $component->id,
            'version' => 'v2.0.0',
            'status' => 'draft',
        ];

        $response = $this->actingAsViewer()
            ->postJson(self::RELEASES_ENDPOINT, $data);

        $response->assertForbidden();
    }
}
