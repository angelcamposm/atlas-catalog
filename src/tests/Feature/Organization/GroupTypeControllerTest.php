<?php

declare(strict_types=1);

namespace Tests\Feature\Organization;

use App\Models\GroupType;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for GroupTypeController (lookup/reference resource).
 */
class GroupTypeControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        GroupType::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/organization/group-types');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Type'];

        $response = $this->postJson('/api/v1/organization/group-types', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $type = GroupType::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/organization/group-types/{$type->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $type->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $type = GroupType::factory()->create();

        $data = ['name' => 'Updated Type'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/organization/group-types/{$type->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Type');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $type = GroupType::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/organization/group-types/{$type->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('group_types', ['id' => $type->id]);
    }
}
