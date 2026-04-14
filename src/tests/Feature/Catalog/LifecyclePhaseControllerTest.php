<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\LifecyclePhase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for LifecyclePhaseController (lookup/reference resource).
 */
class LifecyclePhaseControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        LifecyclePhase::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/lifecycle-phases');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Phase'];

        $response = $this->postJson('/api/v1/catalog/lifecycle-phases', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $phase = LifecyclePhase::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/lifecycle-phases/{$phase->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $phase->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $phase = LifecyclePhase::factory()->create();

        $data = ['name' => 'Updated Phase'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/lifecycle-phases/{$phase->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Phase');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $phase = LifecyclePhase::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/lifecycle-phases/{$phase->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('lifecycle_phases', ['id' => $phase->id]);
    }
}
