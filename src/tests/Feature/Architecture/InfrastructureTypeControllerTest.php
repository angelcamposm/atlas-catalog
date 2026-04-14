<?php

declare(strict_types=1);

namespace Tests\Feature\Architecture;

use App\Models\InfrastructureType;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for InfrastructureTypeController (lookup/reference resource).
 */
class InfrastructureTypeControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        InfrastructureType::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/architecture/infrastructure-types');

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

        $response = $this->postJson('/api/v1/architecture/infrastructure-types', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $type = InfrastructureType::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/architecture/infrastructure-types/{$type->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $type->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $type = InfrastructureType::factory()->create();

        $data = ['name' => 'Updated Type'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/architecture/infrastructure-types/{$type->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Type');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $type = InfrastructureType::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/architecture/infrastructure-types/{$type->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('infrastructure_types', ['id' => $type->id]);
    }
}
