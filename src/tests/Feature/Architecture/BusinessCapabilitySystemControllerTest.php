<?php

declare(strict_types=1);

namespace Tests\Feature\Architecture;

use App\Models\BusinessCapability;
use App\Models\BusinessCapabilitySystem;
use App\Models\System;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for BusinessCapabilitySystemController.
 *
 * Tests CRUD operations for the many-to-many relationship between
 * business capabilities and systems.
 *
 * Endpoints tested:
 * - GET  /api/v1/architecture/business-capability-systems
 * - POST /api/v1/architecture/business-capability-systems
 * - GET  /api/v1/architecture/business-capability-systems/{id}
 * - PUT  /api/v1/architecture/business-capability-systems/{id}
 * - DELETE /api/v1/architecture/business-capability-systems/{id}
 */
class BusinessCapabilitySystemControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_business_capability_systems(): void
    {
        // Arrange
        BusinessCapabilitySystem::factory()->count(8)->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/architecture/business-capability-systems');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'business_capability_id', 'system_id'],
                ],
            ])
            ->assertJsonCount(8, 'data');
    }

    #[Test]
    public function test_show_business_capability_system(): void
    {
        // Arrange
        $relation = BusinessCapabilitySystem::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/architecture/business-capability-systems/{$relation->id}");

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'business_capability_id', 'system_id'],
            ])
            ->assertJsonPath('data.id', $relation->id);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        // Arrange
        $capability = BusinessCapability::factory()->create();
        $system = System::factory()->create();

        // Act
        $response = $this->postJson('/api/v1/architecture/business-capability-systems', [
            'business_capability_id' => $capability->id,
            'system_id' => $system->id,
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_editor_can_create_relationship(): void
    {
        // Arrange
        $capability = BusinessCapability::factory()->create();
        $system = System::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/business-capability-systems', [
                'business_capability_id' => $capability->id,
                'system_id' => $system->id,
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'business_capability_id', 'system_id']]);

        $this->assertDatabaseHas('business_capability_system', [
            'business_capability_id' => $capability->id,
            'system_id' => $system->id,
        ]);
    }

    #[Test]
    public function test_viewer_cannot_create(): void
    {
        // Arrange
        $capability = BusinessCapability::factory()->create();
        $system = System::factory()->create();

        // Act
        $response = $this->actingAsViewer()
            ->postJson('/api/v1/architecture/business-capability-systems', [
                'business_capability_id' => $capability->id,
                'system_id' => $system->id,
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_create_validates_required_fields(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/business-capability-systems', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['business_capability_id', 'system_id']);
    }

    #[Test]
    public function test_create_validates_foreign_keys(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/business-capability-systems', [
                'business_capability_id' => 99999,
                'system_id' => 99999,
            ]);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['business_capability_id', 'system_id']);
    }

    #[Test]
    public function test_update_requires_authorization(): void
    {
        // Arrange
        $relation = BusinessCapabilitySystem::factory()->create();
        $system = System::factory()->create();

        // Act
        $response = $this->putJson(
            "/api/v1/architecture/business-capability-systems/{$relation->id}",
            ['system_id' => $system->id]
        );

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_update(): void
    {
        // Arrange
        $relation = BusinessCapabilitySystem::factory()->create();
        $newSystem = System::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->putJson("/api/v1/architecture/business-capability-systems/{$relation->id}", [
                'system_id' => $newSystem->id,
            ]);

        // Assert
        $response->assertOk();

        $this->assertDatabaseHas('business_capability_system', [
            'id' => $relation->id,
            'system_id' => $newSystem->id,
        ]);
    }

    #[Test]
    public function test_editor_cannot_update(): void
    {
        // Arrange
        $relation = BusinessCapabilitySystem::factory()->create();
        $system = System::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->putJson("/api/v1/architecture/business-capability-systems/{$relation->id}", [
                'system_id' => $system->id,
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_admin_can_delete(): void
    {
        // Arrange
        $relation = BusinessCapabilitySystem::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/architecture/business-capability-systems/{$relation->id}");

        // Assert
        $response->assertNoContent();
        $this->assertDatabaseMissing('business_capability_system', ['id' => $relation->id]);
    }

    #[Test]
    public function test_viewer_cannot_delete(): void
    {
        // Arrange
        $relation = BusinessCapabilitySystem::factory()->create();

        // Act
        $response = $this->actingAsViewer()
            ->deleteJson("/api/v1/architecture/business-capability-systems/{$relation->id}");

        // Assert
        $response->assertForbidden();
    }
}
