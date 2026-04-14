<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\Platform;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for PlatformController (lookup/reference resource).
 */
class PlatformControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        Platform::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/platforms');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Platform'];

        $response = $this->postJson('/api/v1/catalog/platforms', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $platform = Platform::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/platforms/{$platform->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $platform->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $platform = Platform::factory()->create();

        $data = ['name' => 'Updated Platform'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/platforms/{$platform->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Platform');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $platform = Platform::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/platforms/{$platform->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('platforms', ['id' => $platform->id]);
    }
}
