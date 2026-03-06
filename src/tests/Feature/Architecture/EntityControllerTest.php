<?php

declare(strict_types=1);

namespace Tests\Feature\Architecture;

use App\Models\Entity;
use App\Models\BusinessDomain;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for EntityController.
 *
 * Tests CRUD operations for Entity resources.
 */
class EntityControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_entities_returns_paginated_results(): void
    {
        Entity::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/architecture/entities');

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
    public function test_create_entity_as_editor(): void
    {
        $domain = BusinessDomain::factory()->create();

        $data = [
            'name' => 'Order Entity',
            'description' => 'Represents a customer order',
            'business_domain_id' => $domain->id,
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/entities', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Order Entity');

        $this->assertDatabaseHas('entities', ['name' => 'Order Entity']);
    }

    #[Test]
    public function test_create_entity_requires_authentication(): void
    {
        $data = ['name' => 'Test Entity'];

        $response = $this->postJson('/api/v1/architecture/entities', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_entity_by_id(): void
    {
        $entity = Entity::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/architecture/entities/{$entity->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $entity->id);
    }

    #[Test]
    public function test_update_entity_as_editor(): void
    {
        $entity = Entity::factory()->create();

        $data = [
            'name' => 'Updated Entity Name',
            'description' => 'Updated description',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/architecture/entities/{$entity->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Entity Name');

        $this->assertDatabaseHas('entities', [
            'id' => $entity->id,
            'name' => 'Updated Entity Name',
        ]);
    }

    #[Test]
    public function test_delete_entity_as_admin_only(): void
    {
        $entity = Entity::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/architecture/entities/{$entity->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/architecture/entities/{$entity->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('entities', ['id' => $entity->id]);
    }

    #[Test]
    public function test_show_nonexistent_entity_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/architecture/entities/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_entity_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/entities', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_entity(): void
    {
        $data = ['name' => 'Test Entity'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/architecture/entities', $data);

        $response->assertForbidden();
    }
}
