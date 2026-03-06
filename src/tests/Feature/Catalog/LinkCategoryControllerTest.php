<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\LinkCategory;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for LinkCategoryController.
 *
 * Tests HTTP endpoints for CRUD operations on link categories.
 *
 * Endpoints tested:
 * - GET  /api/v1/catalog/link-categories (list)
 * - POST /api/v1/catalog/link-categories (create)
 * - GET  /api/v1/catalog/link-categories/{id} (show)
 * - PUT  /api/v1/catalog/link-categories/{id} (update)
 * - DELETE /api/v1/catalog/link-categories/{id} (delete)
 */
class LinkCategoryControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_link_categories_returns_all_records(): void
    {
        // Arrange
        LinkCategory::factory()->count(5)->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/link-categories');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description'],
                ],
            ])
            ->assertJsonCount(5, 'data');
    }

    #[Test]
    public function test_show_link_category_returns_single_record(): void
    {
        // Arrange
        $category = LinkCategory::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/link-categories/{$category->id}");

        // Assert
        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'slug', 'description']])
            ->assertJsonPath('data.id', $category->id);
    }

    #[Test]
    public function test_create_link_category_requires_editor_role(): void
    {
        // Act
        $response = $this->actingAsViewer()
            ->postJson('/api/v1/catalog/link-categories', [
                'name' => 'Documentation',
                'description' => 'Links to documentation',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_editor_can_create_link_category(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/link-categories', [
                'name' => 'Resources',
                'description' => 'External resources',
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'name', 'slug']]);

        $this->assertDatabaseHas('link_categories', [
            'name' => 'Resources',
            'description' => 'External resources',
        ]);
    }

    #[Test]
    public function test_create_link_category_validates_required_fields(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/link-categories', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function test_update_link_category_requires_authentication(): void
    {
        // Arrange
        $category = LinkCategory::factory()->create();

        // Act
        $response = $this->putJson("/api/v1/catalog/link-categories/{$category->id}", [
            'name' => 'Updated',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_update_link_category(): void
    {
        // Arrange
        $category = LinkCategory::factory()->create(['name' => 'Old Name']);

        // Act
        $response = $this->actingAsAdmin()
            ->putJson("/api/v1/catalog/link-categories/{$category->id}", [
                'name' => 'New Name',
                'description' => 'Updated description',
            ]);

        // Assert
        $response->assertOk();

        $this->assertDatabaseHas('link_categories', [
            'id' => $category->id,
            'name' => 'New Name',
        ]);
    }

    #[Test]
    public function test_admin_can_delete_link_category(): void
    {
        // Arrange
        $category = LinkCategory::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/link-categories/{$category->id}");

        // Assert
        $response->assertNoContent();
        $this->assertDatabaseMissing('link_categories', ['id' => $category->id]);
    }

    #[Test]
    public function test_editor_cannot_delete_link_category(): void
    {
        // Arrange
        $category = LinkCategory::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/catalog/link-categories/{$category->id}");

        // Assert
        $response->assertForbidden();
    }
}
