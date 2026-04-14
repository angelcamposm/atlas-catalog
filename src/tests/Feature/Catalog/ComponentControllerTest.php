<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\Component;
use App\Models\ComponentType;
use App\Models\LifecyclePhase;
use App\Models\Platform;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ComponentController.
 *
 * Tests HTTP endpoints for CRUD operations on components with authentication,
 * validation, pagination, eager loading, and role-based access control.
 *
 * Endpoints tested:
 * - GET  /api/v1/catalog/components (list with pagination)
 * - POST /api/v1/catalog/components (create)
 * - GET  /api/v1/catalog/components/{id} (show)
 * - PUT  /api/v1/catalog/components/{id} (update)
 * - DELETE /api/v1/catalog/components/{id} (delete)
 */
class ComponentControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_components_returns_paginated_results(): void
    {
        // Arrange: Create 15 components (default pagination is 15)
        Component::factory()->count(15)->create();

        // Act: List components as authenticated editor
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/components');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data')
            ->assertJsonPath('meta.total', 15);
    }

    #[Test]
    public function test_list_components_pagination_works(): void
    {
        // Arrange
        Component::factory()->count(25)->create();

        // Act: Get first page (15 items per page)
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/components?page=2');

        // Assert
        $response->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.total', 25);
    }

    #[Test]
    public function test_list_components_with_eager_loading(): void
    {
        // Arrange
        $component = Component::factory()
            ->for(ComponentType::factory())
            ->for(Platform::factory())
            ->has(LifecyclePhase::factory()->count(2), 'lifecyclePhases')
            ->create();

        // Act: Request with 'with' parameter to eager load relationships
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/components?with=platform,componentType,lifecyclePhases');

        // Assert
        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $component->id);
    }

    #[Test]
    public function test_list_components_requires_authentication(): void
    {
        // Act: Try to list without authentication
        $response = $this->getJson('/api/v1/catalog/components');

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_create_component_as_editor(): void
    {
        // Arrange
        $platform = Platform::factory()->create();
        $type = ComponentType::factory()->create();

        $data = [
            'name' => 'Payment Service',
            'description' => 'Handles payment processing',
            'platform_id' => $platform->id,
            'component_type_id' => $type->id,
        ];

        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/components', $data);

        // Assert
        $response->assertCreated()
            ->assertJsonPath('data.name', 'Payment Service')
            ->assertJsonPath('data.description', 'Handles payment processing');

        // Verify in database
        $this->assertDatabaseHas('components', [
            'name' => 'Payment Service',
            'platform_id' => $platform->id,
        ]);
    }

    #[Test]
    public function test_create_component_requires_authentication(): void
    {
        // Arrange
        $data = [
            'name' => 'Test Service',
            'description' => 'Test',
        ];

        // Act: Try to create without authentication
        $response = $this->postJson('/api/v1/catalog/components', $data);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_create_component_validates_required_fields(): void
    {
        // Arrange: Empty data (missing required fields)
        $data = [];

        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/components', $data);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_create_component_validates_name_uniqueness(): void
    {
        // Arrange: Create first component
        Component::factory()->create(['name' => 'Duplicate Name']);

        $data = ['name' => 'Duplicate Name'];

        // Act: Try to create with same name
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/components', $data);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_show_component_by_id(): void
    {
        // Arrange
        $component = Component::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/components/{$component->slug}");

        // Assert
        $response->assertOk()
            ->assertJsonPath('data.id', $component->id)
            ->assertJsonPath('data.name', $component->name);
    }

    #[Test]
    public function test_show_component_with_eager_loading(): void
    {
        // Arrange
        $component = Component::factory()
            ->for(Platform::factory())
            ->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/components/{$component->slug}?with=platform");

        // Assert
        $response->assertOk()
            ->assertJsonPath('data.id', $component->id);
    }

    #[Test]
    public function test_show_nonexistent_component_returns_404(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/components/9999');

        // Assert
        $response->assertNotFound();
    }

    #[Test]
    public function test_update_component_as_editor(): void
    {
        // Arrange
        $component = Component::factory()->create();
        $newPlatform = Platform::factory()->create();

        $data = [
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'platform_id' => $newPlatform->id,
        ];

        // Act
        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/components/{$component->slug}", $data);

        // Assert
        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Name');

        // Verify in database
        $this->assertDatabaseHas('components', [
            'id' => $component->id,
            'name' => 'Updated Name',
        ]);
    }

    #[Test]
    public function test_update_component_requires_authentication(): void
    {
        // Arrange
        $component = Component::factory()->create();
        $data = ['name' => 'New Name'];

        // Act
        $response = $this->putJson("/api/v1/catalog/components/{$component->slug}", $data);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_update_component_validates_input(): void
    {
        // Arrange
        $component = Component::factory()->create();

        // Act: Send invalid data (e.g., empty name)
        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/components/{$component->slug}", ['name' => '']);

        // Assert
        $response->assertUnprocessable();
    }

    #[Test]
    public function test_delete_component_as_admin_only(): void
    {
        // Arrange
        $component = Component::factory()->create();

        // Act: Try to delete as editor (should fail)
        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/catalog/components/{$component->slug}");

        // Assert
        $response->assertForbidden();

        // Act: Delete as admin (should succeed)
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/components/{$component->slug}");

        // Assert
        $response->assertNoContent();

        // Verify deleted from database
        $this->assertDatabaseMissing('components', ['id' => $component->id]);
    }

    #[Test]
    public function test_delete_component_requires_authentication(): void
    {
        // Arrange
        $component = Component::factory()->create();

        // Act
        $response = $this->deleteJson("/api/v1/catalog/components/{$component->id}");

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_viewer_cannot_create_component(): void
    {
        // Arrange
        $data = [
            'name' => 'Test Component',
            'description' => 'Test',
        ];

        // Act: Try to create as viewer
        $response = $this->actingAsViewer()
            ->postJson('/api/v1/catalog/components', $data);

        // Assert: Viewer should not be able to create
        $response->assertForbidden();
    }

    #[Test]
    public function test_viewer_cannot_update_component(): void
    {
        // Arrange
        $component = Component::factory()->create();
        $data = ['name' => 'New Name'];

        // Act: Try to update as viewer
        $response = $this->actingAsViewer()
            ->putJson("/api/v1/catalog/components/{$component->id}", $data);

        // Assert
        $response->assertForbidden();
    }
}
