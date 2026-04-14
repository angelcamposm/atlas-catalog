<?php

declare(strict_types=1);

namespace Tests\Feature\Compliance;

use App\Models\ComplianceRequirement;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ComplianceRequirementController.
 *
 * Tests CRUD operations on compliance requirements that must be
 * satisfied by components and systems.
 *
 * Endpoints tested:
 * - GET  /api/v1/compliance/compliance-requirements
 * - POST /api/v1/compliance/compliance-requirements
 * - GET  /api/v1/compliance/compliance-requirements/{id}
 * - PUT  /api/v1/compliance/compliance-requirements/{id}
 * - DELETE /api/v1/compliance/compliance-requirements/{id}
 */
class ComplianceRequirementControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_compliance_requirements(): void
    {
        // Arrange
        ComplianceRequirement::factory()->count(6)->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/compliance/compliance-requirements');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'description'],
                ],
            ])
            ->assertJsonCount(6, 'data');
    }

    #[Test]
    public function test_show_compliance_requirement(): void
    {
        // Arrange
        $requirement = ComplianceRequirement::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/compliance/compliance-requirements/{$requirement->id}");

        // Assert
        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'description', 'severity']])
            ->assertJsonPath('data.id', $requirement->id);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        // Act
        $response = $this->postJson('/api/v1/compliance/compliance-requirements', [
            'name' => 'Encryption at Rest',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_editor_can_create_requirement(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/compliance/compliance-requirements', [
                'name' => 'GDPR Compliance',
                'description' => 'Ensure GDPR compliance',
                'severity' => 'critical',
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'name']]);

        $this->assertDatabaseHas('compliance_requirements', [
            'name' => 'GDPR Compliance',
            'severity' => 'critical',
        ]);
    }

    #[Test]
    public function test_viewer_cannot_create(): void
    {
        // Act
        $response = $this->actingAsViewer()
            ->postJson('/api/v1/compliance/compliance-requirements', [
                'name' => 'HIPAA Compliance',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_create_validates_required_fields(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/compliance/compliance-requirements', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function test_create_validates_severity_enum(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/compliance/compliance-requirements', [
                'name' => 'Test',
                'severity' => 'invalid_severity',
            ]);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['severity']);
    }

    #[Test]
    public function test_update_requires_authorization(): void
    {
        // Arrange
        $requirement = ComplianceRequirement::factory()->create();

        // Act
        $response = $this->putJson(
            "/api/v1/compliance/compliance-requirements/{$requirement->id}",
            ['name' => 'Updated']
        );

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_update(): void
    {
        // Arrange
        $requirement = ComplianceRequirement::factory()
            ->create(['name' => 'Old Name']);

        // Act
        $response = $this->actingAsAdmin()
            ->putJson("/api/v1/compliance/compliance-requirements/{$requirement->id}", [
                'name' => 'Updated Name',
                'severity' => 'high',
            ]);

        // Assert
        $response->assertOk();

        $this->assertDatabaseHas('compliance_requirements', [
            'id' => $requirement->id,
            'name' => 'Updated Name',
        ]);
    }

    #[Test]
    public function test_editor_cannot_update(): void
    {
        // Arrange
        $requirement = ComplianceRequirement::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->putJson("/api/v1/compliance/compliance-requirements/{$requirement->id}", [
                'name' => 'Updated',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_admin_can_delete(): void
    {
        // Arrange
        $requirement = ComplianceRequirement::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/compliance/compliance-requirements/{$requirement->id}");

        // Assert
        $response->assertNoContent();
        $this->assertDatabaseMissing('compliance_requirements', ['id' => $requirement->id]);
    }

    #[Test]
    public function test_viewer_cannot_delete(): void
    {
        // Arrange
        $requirement = ComplianceRequirement::factory()->create();

        // Act
        $response = $this->actingAsViewer()
            ->deleteJson("/api/v1/compliance/compliance-requirements/{$requirement->id}");

        // Assert
        $response->assertForbidden();
    }
}
