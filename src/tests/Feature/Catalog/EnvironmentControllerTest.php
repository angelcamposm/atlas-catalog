<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\Environment;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for EnvironmentController (lookup/reference resource).
 */
class EnvironmentControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        Environment::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/environments');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Environment'];

        $response = $this->postJson('/api/v1/catalog/environments', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $env = Environment::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/environments/{$env->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $env->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $env = Environment::factory()->create();

        $data = ['name' => 'Updated Environment'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/environments/{$env->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Environment');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $env = Environment::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/environments/{$env->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('environments', ['id' => $env->id]);
    }
}
