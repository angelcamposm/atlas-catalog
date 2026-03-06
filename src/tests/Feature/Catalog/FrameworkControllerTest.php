<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\Framework;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for FrameworkController (lookup/reference resource).
 */
class FrameworkControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        Framework::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/frameworks');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Framework'];

        $response = $this->postJson('/api/v1/catalog/frameworks', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $framework = Framework::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/frameworks/{$framework->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $framework->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $framework = Framework::factory()->create();

        $data = ['name' => 'Updated Framework'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/frameworks/{$framework->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Framework');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $framework = Framework::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/frameworks/{$framework->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('frameworks', ['id' => $framework->id]);
    }
}
