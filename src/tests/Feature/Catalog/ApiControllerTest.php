<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\Api;
use App\Models\ApiType;
use App\Models\ApiStatus;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ApiController.
 *
 * Tests CRUD operations for API resources.
 *
 * Endpoints:
 * - GET /api/v1/catalog/apis
 * - POST /api/v1/catalog/apis
 * - GET /api/v1/catalog/apis/{id}
 * - PUT /api/v1/catalog/apis/{id}
 * - DELETE /api/v1/catalog/apis/{id}
 */
class ApiControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_apis_returns_paginated_results(): void
    {
        Api::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/apis');

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
    public function test_create_api_as_editor(): void
    {
        $type = ApiType::factory()->create();
        $status = ApiStatus::factory()->create();

        $data = [
            'name' => 'User Management API',
            'description' => 'Handles user operations',
            'api_type_id' => $type->id,
            'api_status_id' => $status->id,
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/apis', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'User Management API');

        $this->assertDatabaseHas('apis', ['name' => 'User Management API']);
    }

    #[Test]
    public function test_create_api_requires_authentication(): void
    {
        $data = ['name' => 'Test API'];

        $response = $this->postJson('/api/v1/catalog/apis', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_api_by_id(): void
    {
        $api = Api::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/apis/{$api->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $api->id);
    }

    #[Test]
    public function test_update_api_as_editor(): void
    {
        $api = Api::factory()->create();

        $data = [
            'name' => 'Updated API Name',
            'description' => 'Updated description',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/apis/{$api->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated API Name');

        $this->assertDatabaseHas('apis', [
            'id' => $api->id,
            'name' => 'Updated API Name',
        ]);
    }

    #[Test]
    public function test_delete_api_as_admin_only(): void
    {
        $api = Api::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/catalog/apis/{$api->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/apis/{$api->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('apis', ['id' => $api->id]);
    }

    #[Test]
    public function test_show_nonexistent_api_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/apis/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_api_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/apis', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_api(): void
    {
        $data = ['name' => 'Test API'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/catalog/apis', $data);

        $response->assertForbidden();
    }
}
