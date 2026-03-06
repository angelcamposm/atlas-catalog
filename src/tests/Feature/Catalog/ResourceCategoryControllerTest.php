<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\ResourceCategory;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ResourceCategoryController.
 *
 * Tests CRUD operations for resource categories used to classify
 * infrastructure resources (servers, databases, etc.).
 *
 * Endpoints tested:
 * - GET  /api/v1/catalog/resource-categories
 * - POST /api/v1/catalog/resource-categories
 * - GET  /api/v1/catalog/resource-categories/{id}
 * - PUT  /api/v1/catalog/resource-categories/{id}
 * - DELETE /api/v1/catalog/resource-categories/{id}
 */
class ResourceCategoryControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_resource_categories(): void
    {
        // Arrange
        ResourceCategory::factory()->count(8)->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/resource-categories');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'icon', 'color'],
                ],
            ])
            ->assertJsonCount(8, 'data');
    }

    #[Test]
    public function test_show_resource_category(): void
    {
        // Arrange
        $category = ResourceCategory::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/resource-categories/{$category->id}");

        // Assert
        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'icon', 'color']])
            ->assertJsonPath('data.id', $category->id);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        // Act
        $response = $this->postJson('/api/v1/catalog/resource-categories', [
            'name' => 'Compute',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_editor_can_create_resource_category(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/resource-categories', [
                'name' => 'Database',
                'icon' => 'database',
                'color' => '#FF5733',
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'name', 'icon', 'color']]);

        $this->assertDatabaseHas('resource_categories', [
            'name' => 'Database',
            'icon' => 'database',
        ]);
    }

    #[Test]
    public function test_viewer_cannot_create(): void
    {
        // Act
        $response = $this->actingAsViewer()
            ->postJson('/api/v1/catalog/resource-categories', [
                'name' => 'Network',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_create_validates_required_fields(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/resource-categories', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function test_update_requires_authentication(): void
    {
        // Arrange
        $category = ResourceCategory::factory()->create();

        // Act
        $response = $this->putJson(
            "/api/v1/catalog/resource-categories/{$category->id}",
            ['name' => 'Updated']
        );

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_update(): void
    {
        // Arrange
        $category = ResourceCategory::factory()->create(['name' => 'Old']);

        // Act
        $response = $this->actingAsAdmin()
            ->putJson("/api/v1/catalog/resource-categories/{$category->id}", [
                'name' => 'Updated Name',
                'color' => '#00FF00',
            ]);

        // Assert
        $response->assertOk();

        $this->assertDatabaseHas('resource_categories', [
            'id' => $category->id,
            'name' => 'Updated Name',
        ]);
    }

    #[Test]
    public function test_editor_cannot_update(): void
    {
        // Arrange
        $category = ResourceCategory::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/resource-categories/{$category->id}", [
                'name' => 'Updated',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_admin_can_delete(): void
    {
        // Arrange
        $category = ResourceCategory::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/resource-categories/{$category->id}");

        // Assert
        $response->assertNoContent();
        $this->assertDatabaseMissing('resource_categories', ['id' => $category->id]);
    }

    #[Test]
    public function test_editor_cannot_delete(): void
    {
        // Arrange
        $category = ResourceCategory::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/catalog/resource-categories/{$category->id}");

        // Assert
        $response->assertForbidden();
    }
}
