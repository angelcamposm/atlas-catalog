<?php

declare(strict_types=1);

namespace Tests\Feature\Organization;

use App\Models\Group;
use App\Models\GroupType;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for GroupController.
 *
 * Tests CRUD operations for Group resources.
 */
class GroupControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_groups_returns_paginated_results(): void
    {
        Group::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/organization/groups');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_create_group_as_editor(): void
    {
        $type = GroupType::factory()->create();

        $data = [
            'name' => 'Platform Team',
            'description' => 'Team responsible for platform infrastructure',
            'group_type_id' => $type->id,
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/organization/groups', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Platform Team');

        $this->assertDatabaseHas('groups', ['name' => 'Platform Team']);
    }

    #[Test]
    public function test_create_group_requires_authentication(): void
    {
        $data = ['name' => 'Test Group'];

        $response = $this->postJson('/api/v1/organization/groups', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_group_by_id(): void
    {
        $group = Group::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/organization/groups/{$group->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $group->id);
    }

    #[Test]
    public function test_update_group_as_editor(): void
    {
        $group = Group::factory()->create();

        $data = [
            'name' => 'Updated Group Name',
            'description' => 'Updated description',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/organization/groups/{$group->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Group Name');

        $this->assertDatabaseHas('groups', [
            'id' => $group->id,
            'name' => 'Updated Group Name',
        ]);
    }

    #[Test]
    public function test_delete_group_as_admin_only(): void
    {
        $group = Group::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/organization/groups/{$group->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/organization/groups/{$group->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('groups', ['id' => $group->id]);
    }

    #[Test]
    public function test_show_nonexistent_group_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/organization/groups/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_group_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/organization/groups', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_group(): void
    {
        $data = ['name' => 'Test Group'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/organization/groups', $data);

        $response->assertForbidden();
    }
}
