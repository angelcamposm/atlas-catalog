<?php

declare(strict_types=1);

namespace Tests\Feature\Organization;

use App\Models\Group;
use App\Models\GroupMember;
use App\Models\GroupMemberRole;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for GroupMemberRoleController.
 *
 * Tests CRUD operations for group member roles that define
 * permissions of users within groups.
 *
 * Endpoints tested:
 * - GET  /api/v1/organization/group-member-roles
 * - POST /api/v1/organization/group-member-roles
 * - GET  /api/v1/organization/group-member-roles/{id}
 * - PUT  /api/v1/organization/group-member-roles/{id}
 * - DELETE /api/v1/organization/group-member-roles/{id}
 */
class GroupMemberRoleControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_group_member_roles(): void
    {
        // Arrange
        GroupMemberRole::factory()->count(5)->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/organization/group-member-roles');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'description'],
                ],
            ])
            ->assertJsonCount(5, 'data');
    }

    #[Test]
    public function test_show_group_member_role(): void
    {
        // Arrange
        $role = GroupMemberRole::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->getJson("/api/v1/organization/group-member-roles/{$role->id}");

        // Assert
        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'description']])
            ->assertJsonPath('data.id', $role->id);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        // Act
        $response = $this->postJson('/api/v1/organization/group-member-roles', [
            'name' => 'Maintainer',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_create_group_member_role(): void
    {
        // Act
        $response = $this->actingAsAdmin()
            ->postJson('/api/v1/organization/group-member-roles', [
                'name' => 'Technical Lead',
                'description' => 'Leads technical decisions',
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'name']]);

        $this->assertDatabaseHas('group_member_roles', [
            'name' => 'Technical Lead',
        ]);
    }

    #[Test]
    public function test_editor_cannot_create(): void
    {
        // Act
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/organization/group-member-roles', [
                'name' => 'Reviewer',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_create_validates_required_fields(): void
    {
        // Act
        $response = $this->actingAsAdmin()
            ->postJson('/api/v1/organization/group-member-roles', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function test_update_requires_authorization(): void
    {
        // Arrange
        $role = GroupMemberRole::factory()->create();

        // Act
        $response = $this->putJson(
            "/api/v1/organization/group-member-roles/{$role->id}",
            ['name' => 'Updated']
        );

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_admin_can_update(): void
    {
        // Arrange
        $role = GroupMemberRole::factory()->create(['name' => 'Old Name']);

        // Act
        $response = $this->actingAsAdmin()
            ->putJson("/api/v1/organization/group-member-roles/{$role->id}", [
                'name' => 'Updated Name',
                'description' => 'New description',
            ]);

        // Assert
        $response->assertOk();

        $this->assertDatabaseHas('group_member_roles', [
            'id' => $role->id,
            'name' => 'Updated Name',
        ]);
    }

    #[Test]
    public function test_editor_cannot_update(): void
    {
        // Arrange
        $role = GroupMemberRole::factory()->create();

        // Act
        $response = $this->actingAsEditor()
            ->putJson("/api/v1/organization/group-member-roles/{$role->id}", [
                'name' => 'Updated',
            ]);

        // Assert
        $response->assertForbidden();
    }

    #[Test]
    public function test_admin_can_delete(): void
    {
        // Arrange
        $role = GroupMemberRole::factory()->create();

        // Act
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/organization/group-member-roles/{$role->id}");

        // Assert
        $response->assertNoContent();
        $this->assertDatabaseMissing('group_member_roles', ['id' => $role->id]);
    }

    #[Test]
    public function test_viewer_cannot_delete(): void
    {
        // Arrange
        $role = GroupMemberRole::factory()->create();

        // Act
        $response = $this->actingAsViewer()
            ->deleteJson("/api/v1/organization/group-member-roles/{$role->id}");

        // Assert
        $response->assertForbidden();
    }
}
