<?php

declare(strict_types=1);

namespace Tests\Feature\Architecture;

use App\Models\BusinessCapability;
use App\Models\Organization;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for BusinessCapabilityController.
 *
 * Tests CRUD operations on business capabilities that represent
 * high-level functional areas of the organization.
 *
 * Endpoints tested:
 * - GET  /api/v1/architecture/business-capabilities (list with pagination)
 * - POST /api/v1/architecture/business-capabilities (create)
 * - GET  /api/v1/architecture/business-capabilities/{id} (show)
 * - PUT  /api/v1/architecture/business-capabilities/{id} (update)
 * - DELETE /api/v1/architecture/business-capabilities/{id} (delete)
 */
class BusinessCapabilityControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_business_capabilities_returns_paginated_results(): void
    {
        // Arrange
        BusinessCapability::factory()->count(15)->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/architecture/business-capabilities');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'description', 'created_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_show_business_capability_returns_single_record(): void
    {
        // Arrange
        $capability = BusinessCapability::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/architecture/business-capabilities/{$capability->id}");

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'name', 'description', 'organization_id'],
            ])
            ->assertJsonPath('data.id', $capability->id);
    }

    #[Test]
    public function test_create_business_capability_requires_authentication(): void
    {
        // Act
        $response = $this->postJson('/api/v1/architecture/business-capabilities', [
            'name' => 'Sales',
            'description' => 'Sales capabilities',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_editor_can_create_business_capability(): void
    {
        // Arrange
        $organization = Organization::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/business-capabilities', [
                'name' => 'Marketing',
                'description' => 'Marketing and promotions',
                'organization_id' => $organization->id,
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'name', 'description']]);

        $this->assertDatabaseHas('business_capabilities', [
            'name' => 'Marketing',
            'organization_id' => $organization->id,
        ]);
    }

    #[Test]
    public function test_viewer_cannot_create_business_capability(): void
    {
        // Arrange
        $organization = Organization::factory()->create();

        // Act
        $response = $this->actingAsViewer()
            ->postJson('/api/v1/architecture/business-capabilities', [
                'name' => 'HR',
                'organization_id' => $organization->id,
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_create_business_capability_validates_required_fields(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/business-capabilities', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'organization_id']);
    }

    #[Test]
    public function test_update_business_capability_requires_authentication(): void
    {
        // Arrange
        $capability = BusinessCapability::factory()->create();

        // Act
        $response = $this->putJson(
            "/api/v1/architecture/business-capabilities/{$capability->id}",
            ['name' => 'Updated']
        );

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_update_business_capability(): void
    {
        // Arrange
        $capability = BusinessCapability::factory()
            ->create(['name' => 'Old Name']);

        // Act
        $response = $this->actingAsAdmin()
            ->putJson("/api/v1/architecture/business-capabilities/{$capability->id}", [
                'name' => 'Updated Name',
                'description' => 'Updated description',
            ]);

        // Assert
        $response->assertOk();

        $this->assertDatabaseHas('business_capabilities', [
            'id' => $capability->id,
            'name' => 'Updated Name',
        ]);
    }

    #[Test]
    public function test_editor_cannot_update_business_capability(): void
    {
        // Arrange
        $capability = BusinessCapability::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->putJson("/api/v1/architecture/business-capabilities/{$capability->id}", [
                'name' => 'Updated',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_admin_can_delete_business_capability(): void
    {
        // Arrange
        $capability = BusinessCapability::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/architecture/business-capabilities/{$capability->id}");

        // Assert
        $response->assertNoContent();
        $this->assertDatabaseMissing('business_capabilities', ['id' => $capability->id]);
    }

    #[Test]
    public function test_editor_cannot_delete_business_capability(): void
    {
        // Arrange
        $capability = BusinessCapability::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/architecture/business-capabilities/{$capability->id}");

        // Assert
        $response->assertForbidden();
    }
}
