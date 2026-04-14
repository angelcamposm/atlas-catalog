<?php

declare(strict_types=1);

namespace Tests\Feature\Infrastructure;

use App\Models\Node;
use App\Models\Cluster;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for NodeController.
 *
 * Tests CRUD operations for Node resources.
 */
class NodeControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_nodes_returns_paginated_results(): void
    {
        Node::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/infrastructure/nodes');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_create_node_as_editor(): void
    {
        $cluster = Cluster::factory()->create();

        $data = [
            'name' => 'node-1',
            'description' => 'Worker node in cluster',
            'cluster_id' => $cluster->id,
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/infrastructure/nodes', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'node-1');

        $this->assertDatabaseHas('nodes', ['name' => 'node-1']);
    }

    #[Test]
    public function test_create_node_requires_authentication(): void
    {
        $data = ['name' => 'test-node'];

        $response = $this->postJson('/api/v1/infrastructure/nodes', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_node_by_id(): void
    {
        $node = Node::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/infrastructure/nodes/{$node->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $node->id);
    }

    #[Test]
    public function test_update_node_as_editor(): void
    {
        $node = Node::factory()->create();

        $data = [
            'name' => 'updated-node',
            'description' => 'Updated description',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/infrastructure/nodes/{$node->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'updated-node');

        $this->assertDatabaseHas('nodes', [
            'id' => $node->id,
            'name' => 'updated-node',
        ]);
    }

    #[Test]
    public function test_delete_node_as_admin_only(): void
    {
        $node = Node::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/infrastructure/nodes/{$node->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/infrastructure/nodes/{$node->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('nodes', ['id' => $node->id]);
    }

    #[Test]
    public function test_show_nonexistent_node_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/infrastructure/nodes/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_node_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/infrastructure/nodes', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_node(): void
    {
        $data = ['name' => 'test-node'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/infrastructure/nodes', $data);

        $response->assertForbidden();
    }
}
