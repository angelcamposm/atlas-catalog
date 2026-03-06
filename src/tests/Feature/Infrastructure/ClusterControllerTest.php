<?php

declare(strict_types=1);

namespace Tests\Feature\Infrastructure;

use App\Models\Cluster;
use App\Models\ClusterType;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ClusterController.
 *
 * Tests CRUD operations for Cluster resources.
 */
class ClusterControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_clusters_returns_paginated_results(): void
    {
        Cluster::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/infrastructure/clusters');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_create_cluster_as_editor(): void
    {
        $type = ClusterType::factory()->create();

        $data = [
            'name' => 'Kubernetes Cluster 1',
            'description' => 'Production cluster',
            'cluster_type_id' => $type->id,
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/infrastructure/clusters', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Kubernetes Cluster 1');

        $this->assertDatabaseHas('clusters', ['name' => 'Kubernetes Cluster 1']);
    }

    #[Test]
    public function test_create_cluster_requires_authentication(): void
    {
        $data = ['name' => 'Test Cluster'];

        $response = $this->postJson('/api/v1/infrastructure/clusters', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_cluster_by_id(): void
    {
        $cluster = Cluster::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/infrastructure/clusters/{$cluster->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $cluster->id);
    }

    #[Test]
    public function test_update_cluster_as_editor(): void
    {
        $cluster = Cluster::factory()->create();

        $data = [
            'name' => 'Updated Cluster Name',
            'description' => 'Updated description',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/infrastructure/clusters/{$cluster->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Cluster Name');

        $this->assertDatabaseHas('clusters', [
            'id' => $cluster->id,
            'name' => 'Updated Cluster Name',
        ]);
    }

    #[Test]
    public function test_delete_cluster_as_admin_only(): void
    {
        $cluster = Cluster::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/infrastructure/clusters/{$cluster->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/infrastructure/clusters/{$cluster->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('clusters', ['id' => $cluster->id]);
    }

    #[Test]
    public function test_show_nonexistent_cluster_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/infrastructure/clusters/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_cluster_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/infrastructure/clusters', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_cluster(): void
    {
        $data = ['name' => 'Test Cluster'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/infrastructure/clusters', $data);

        $response->assertForbidden();
    }
}
