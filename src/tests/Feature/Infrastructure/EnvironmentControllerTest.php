<?php

declare(strict_types=1);

namespace Tests\Feature\Infrastructure;

use App\Models\Environment;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for EnvironmentController.
 *
 * Tests CRUD operations on deployment environments (dev, staging, production, etc.).
 *
 * Endpoints tested:
 * - GET  /api/v1/infrastructure/environments
 * - POST /api/v1/infrastructure/environments
 * - GET  /api/v1/infrastructure/environments/{id}
 * - PUT  /api/v1/infrastructure/environments/{id}
 * - DELETE /api/v1/infrastructure/environments/{id}
 */
class EnvironmentControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_environments(): void
    {
        // Arrange
        Environment::factory()->count(5)->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/infrastructure/environments');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'type'],
                ],
            ])
            ->assertJsonCount(5, 'data');
    }

    #[Test]
    public function test_show_environment(): void
    {
        // Arrange
        $env = Environment::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/infrastructure/environments/{$env->id}");

        // Assert
        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'slug', 'type']])
            ->assertJsonPath('data.id', $env->id);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        // Act
        $response = $this->postJson('/api/v1/infrastructure/environments', [
            'name' => 'Staging',
            'type' => 'staging',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_editor_can_create_environment(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/infrastructure/environments', [
                'name' => 'Production',
                'type' => 'production',
                'description' => 'Production environment',
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'name', 'slug', 'type']]);

        $this->assertDatabaseHas('environments', [
            'name' => 'Production',
            'type' => 'production',
        ]);
    }

    #[Test]
    public function test_viewer_cannot_create(): void
    {
        // Act
        $response = $this->actingAsViewer()
            ->postJson('/api/v1/infrastructure/environments', [
                'name' => 'Development',
                'type' => 'development',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_create_validates_required_fields(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/infrastructure/environments', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'type']);
    }

    #[Test]
    public function test_create_validates_type_enum(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/infrastructure/environments', [
                'name' => 'Test',
                'type' => 'invalid_type',
            ]);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['type']);
    }

    #[Test]
    public function test_update_requires_authorization(): void
    {
        // Arrange
        $env = Environment::factory()->create();

        // Act
        $response = $this->putJson(
            "/api/v1/infrastructure/environments/{$env->id}",
            ['name' => 'Updated']
        );

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_update(): void
    {
        // Arrange
        $env = Environment::factory()->create(['name' => 'Old Name']);

        // Act
        $response = $this->actingAsAdmin()
            ->putJson("/api/v1/infrastructure/environments/{$env->id}", [
                'name' => 'Updated Name',
                'description' => 'Updated description',
            ]);

        // Assert
        $response->assertOk();

        $this->assertDatabaseHas('environments', [
            'id' => $env->id,
            'name' => 'Updated Name',
        ]);
    }

    #[Test]
    public function test_editor_cannot_update(): void
    {
        // Arrange
        $env = Environment::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->putJson("/api/v1/infrastructure/environments/{$env->id}", [
                'name' => 'Updated',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_admin_can_delete(): void
    {
        // Arrange
        $env = Environment::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/infrastructure/environments/{$env->id}");

        // Assert
        $response->assertNoContent();
        $this->assertDatabaseMissing('environments', ['id' => $env->id]);
    }

    #[Test]
    public function test_viewer_cannot_delete(): void
    {
        // Arrange
        $env = Environment::factory()->create();

        // Act
        $response = $this->actingAsViewer()
            ->deleteJson("/api/v1/infrastructure/environments/{$env->id}");

        // Assert
        $response->assertForbidden();
    }
}
