<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

use App\Models\Release;
use App\Models\Api;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ReleaseController.
 *
 * Tests CRUD operations for Release resources.
 */
class ReleaseControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_releases_returns_paginated_results(): void
    {
        Release::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/ci-cd/releases');

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
        $api = Api::factory()->create();

        $data = [
            'version' => 'v1.0.0',
            'description' => 'First production release',
            'api_id' => $api->id,
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/ci-cd/releases', $data);

        $response->assertCreated()
            ->assertJsonPath('data.version', 'v1.0.0');

        $this->assertDatabaseHas('releases', ['version' => 'v1.0.0']);
    }

    #[Test]
    public function test_create_release_requires_authentication(): void
    {
        $data = ['version' => 'v1.0.0'];

        $response = $this->postJson('/api/v1/ci-cd/releases', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_release_by_id(): void
    {
        $release = Release::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/ci-cd/releases/{$release->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $release->id);
    }

    #[Test]
    public function test_update_release_as_editor(): void
    {
        $release = Release::factory()->create();

        $data = [
            'version' => 'v1.0.1',
            'description' => 'Patch release',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/ci-cd/releases/{$release->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.version', 'v1.0.1');

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
            ->deleteJson("/api/v1/ci-cd/releases/{$release->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/ci-cd/releases/{$release->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('releases', ['id' => $release->id]);
    }

    #[Test]
    public function test_show_nonexistent_release_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/ci-cd/releases/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_release_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/ci-cd/releases', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_release(): void
    {
        $data = ['version' => 'v1.0.0'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/ci-cd/releases', $data);

        $response->assertForbidden();
    }
}
