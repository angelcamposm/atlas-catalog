<?php

declare(strict_types=1);

namespace Tests\Feature\Operations;

use App\Models\Metric;
use App\Models\MetricDefinition;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for MetricController.
 *
 * Tests CRUD operations on operational metrics collected from systems
 * performance, availability, and health monitoring.
 *
 * Endpoints tested:
 * - GET  /api/v1/operations/metrics
 * - POST /api/v1/operations/metrics
 * - GET  /api/v1/operations/metrics/{id}
 * - PUT  /api/v1/operations/metrics/{id}
 * - DELETE /api/v1/operations/metrics/{id}
 */
class MetricControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_metrics(): void
    {
        // Arrange
        Metric::factory()->count(10)->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/operations/metrics');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'value', 'metric_definition_id'],
                ],
            ])
            ->assertJsonCount(10, 'data');
    }

    #[Test]
    public function test_show_metric(): void
    {
        // Arrange
        $metric = Metric::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/operations/metrics/{$metric->id}");

        // Assert
        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'value', 'unit']])
            ->assertJsonPath('data.id', $metric->id);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        // Arrange
        $definition = MetricDefinition::factory()->create();

        // Act
        $response = $this->postJson('/api/v1/operations/metrics', [
            'name' => 'CPU Usage',
            'value' => 45.5,
            'metric_definition_id' => $definition->id,
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_editor_can_create_metric(): void
    {
        // Arrange
        $definition = MetricDefinition::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/operations/metrics', [
                'name' => 'Memory Usage',
                'value' => 72.3,
                'unit' => 'percent',
                'metric_definition_id' => $definition->id,
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'name', 'value']]);

        $this->assertDatabaseHas('metrics', [
            'name' => 'Memory Usage',
            'value' => 72.3,
        ]);
    }

    #[Test]
    public function test_viewer_cannot_create(): void
    {
        // Arrange
        $definition = MetricDefinition::factory()->create();

        // Act
        $response = $this->actingAsViewer()
            ->postJson('/api/v1/operations/metrics', [
                'name' => 'Disk Usage',
                'value' => 85.0,
                'metric_definition_id' => $definition->id,
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_create_validates_required_fields(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/operations/metrics', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'value', 'metric_definition_id']);
    }

    #[Test]
    public function test_create_validates_numeric_value(): void
    {
        // Arrange
        $definition = MetricDefinition::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/operations/metrics', [
                'name' => 'Test',
                'value' => 'not_a_number',
                'metric_definition_id' => $definition->id,
            ]);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['value']);
    }

    #[Test]
    public function test_update_requires_authorization(): void
    {
        // Arrange
        $metric = Metric::factory()->create();

        // Act
        $response = $this->putJson(
            "/api/v1/operations/metrics/{$metric->id}",
            ['value' => 50.0]
        );

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_update(): void
    {
        // Arrange
        $metric = Metric::factory()->create(['value' => 30.0]);

        // Act
        $response = $this->actingAsAdmin()
            ->putJson("/api/v1/operations/metrics/{$metric->id}", [
                'value' => 75.5,
                'name' => 'Updated Metric',
            ]);

        // Assert
        $response->assertOk();

        $this->assertDatabaseHas('metrics', [
            'id' => $metric->id,
            'value' => 75.5,
        ]);
    }

    #[Test]
    public function test_editor_cannot_update(): void
    {
        // Arrange
        $metric = Metric::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->putJson("/api/v1/operations/metrics/{$metric->id}", [
                'value' => 60.0,
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_admin_can_delete(): void
    {
        // Arrange
        $metric = Metric::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/operations/metrics/{$metric->id}");

        // Assert
        $response->assertNoContent();
        $this->assertDatabaseMissing('metrics', ['id' => $metric->id]);
    }

    #[Test]
    public function test_viewer_cannot_delete(): void
    {
        // Arrange
        $metric = Metric::factory()->create();

        // Act
        $response = $this->actingAsViewer()
            ->deleteJson("/api/v1/operations/metrics/{$metric->id}");

        // Assert
        $response->assertForbidden();
    }
}
