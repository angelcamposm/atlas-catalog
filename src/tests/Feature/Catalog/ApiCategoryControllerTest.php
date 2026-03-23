<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\ApiCategory;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ApiCategoryController (lookup/reference resource).
 */
class ApiCategoryControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        ApiCategory::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/api-categories');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Category'];

        $response = $this->postJson('/api/v1/catalog/api-categories', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $category = ApiCategory::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/api-categories/{$category->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $category->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $category = ApiCategory::factory()->create();

        $data = ['name' => 'Updated Category'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/api-categories/{$category->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Category');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $category = ApiCategory::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/api-categories/{$category->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
