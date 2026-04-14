<?php

declare(strict_types=1);

namespace Tests\Feature\Infrastructure;

use App\Models\ClusterType;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ClusterTypeController (lookup/reference resource).
 */
class ClusterTypeControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        ClusterType::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/infrastructure/cluster-types');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Type'];

        $response = $this->postJson('/api/v1/infrastructure/cluster-types', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $type = ClusterType::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/infrastructure/cluster-types/{$type->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $type->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $type = ClusterType::factory()->create();

        $data = ['name' => 'Updated Type'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/infrastructure/cluster-types/{$type->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Type');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $type = ClusterType::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/infrastructure/cluster-types/{$type->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('cluster_types', ['id' => $type->id]);
    }
}
