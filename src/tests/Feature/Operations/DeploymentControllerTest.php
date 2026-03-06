<?php

declare(strict_types=1);

namespace Tests\Feature\Operations;

use App\Models\Deployment;
use App\Models\Api;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for DeploymentController.
 *
 * Tests CRUD operations for Deployment resources.
 */
class DeploymentControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_deployments_returns_paginated_results(): void
    {
        Deployment::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/operations/deployments');

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
    public function test_create_deployment_as_editor(): void
    {
        $api = Api::factory()->create();

        $data = [
            'api_id' => $api->id,
            'description' => 'Deploy to production',
            'status' => 'pending',
            'environment' => 'production',
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/operations/deployments', $data);

        $response->assertCreated()
            ->assertJsonPath('data.environment', 'production');

        $this->assertDatabaseHas('deployments', [
            'environment' => 'production',
        ]);
    }

    #[Test]
    public function test_create_deployment_requires_authentication(): void
    {
        $data = ['status' => 'pending'];

        $response = $this->postJson('/api/v1/operations/deployments', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_deployment_by_id(): void
    {
        $deployment = Deployment::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/operations/deployments/{$deployment->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $deployment->id);
    }

    #[Test]
    public function test_update_deployment_as_editor(): void
    {
        $deployment = Deployment::factory()->create();

        $data = [
            'status' => 'success',
            'description' => 'Deployment successful',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/operations/deployments/{$deployment->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.status', 'success');

        $this->assertDatabaseHas('deployments', [
            'id' => $deployment->id,
            'status' => 'success',
        ]);
    }

    #[Test]
    public function test_delete_deployment_as_admin_only(): void
    {
        $deployment = Deployment::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/operations/deployments/{$deployment->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/operations/deployments/{$deployment->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('deployments', ['id' => $deployment->id]);
    }

    #[Test]
    public function test_show_nonexistent_deployment_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/operations/deployments/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_deployment_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/operations/deployments', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_deployment(): void
    {
        $data = ['status' => 'pending'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/operations/deployments', $data);

        $response->assertForbidden();
    }
}
