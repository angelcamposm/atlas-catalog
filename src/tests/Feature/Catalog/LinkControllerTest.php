<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\Component;
use App\Models\Link;
use App\Models\LinkCategory;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for LinkController.
 *
 * Tests HTTP endpoints for CRUD operations on links.
 *
 * Endpoints tested:
 * - GET  /api/v1/catalog/links (list with pagination)
 * - POST /api/v1/catalog/links (create)
 * - GET  /api/v1/catalog/links/{id} (show)
 * - PUT  /api/v1/catalog/links/{id} (update)
 * - DELETE /api/v1/catalog/links/{id} (delete)
 */
class LinkControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_links_returns_paginated_results(): void
    {
        // Arrange
        Link::factory()->count(15)->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/links');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'url', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_show_link_returns_single_record(): void
    {
        // Arrange
        $link = Link::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/links/{$link->id}");

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'name', 'url', 'link_category_id', 'created_at', 'updated_at'],
            ])
            ->assertJsonPath('data.id', $link->id);
    }

    #[Test]
    public function test_create_link_requires_authentication(): void
    {
        // Act
        $response = $this->postJson('/api/v1/catalog/links', [
            'name' => 'Example Link',
            'url' => 'https://example.com',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_editor_can_create_link(): void
    {
        // Arrange
        $category = LinkCategory::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/links', [
                'name' => 'New Link',
                'url' => 'https://example.com',
                'link_category_id' => $category->id,
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'name', 'url']]);

        $this->assertDatabaseHas('links', [
            'name' => 'New Link',
            'url' => 'https://example.com',
        ]);
    }

    #[Test]
    public function test_viewer_cannot_create_link(): void
    {
        // Arrange
        $category = LinkCategory::factory()->create();

        // Act
        $response = $this->actingAsViewer()
            ->postJson('/api/v1/catalog/links', [
                'name' => 'New Link',
                'url' => 'https://example.com',
                'link_category_id' => $category->id,
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_create_link_validates_required_fields(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/catalog/links', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'url']);
    }

    #[Test]
    public function test_update_link_requires_authentication(): void
    {
        // Arrange
        $link = Link::factory()->create();

        // Act
        $response = $this->putJson("/api/v1/catalog/links/{$link->id}", [
            'name' => 'Updated Name',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_delete_link(): void
    {
        // Arrange
        $link = Link::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/links/{$link->id}");

        // Assert
        $response->assertNoContent();
        $this->assertDatabaseMissing('links', ['id' => $link->id]);
    }

    #[Test]
    public function test_editor_cannot_delete_link(): void
    {
        // Arrange
        $link = Link::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/catalog/links/{$link->id}");

        // Assert
        $response->assertForbidden();
    }
}
