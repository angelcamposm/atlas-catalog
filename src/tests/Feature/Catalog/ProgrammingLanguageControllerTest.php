<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\ProgrammingLanguage;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ProgrammingLanguageController (lookup/reference resource).
 */
class ProgrammingLanguageControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        ProgrammingLanguage::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/programming-languages');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Language'];

        $response = $this->postJson('/api/v1/catalog/programming-languages', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $language = ProgrammingLanguage::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/programming-languages/{$language->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $language->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $language = ProgrammingLanguage::factory()->create();

        $data = ['name' => 'Updated Language'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/programming-languages/{$language->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Language');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $language = ProgrammingLanguage::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/programming-languages/{$language->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('programming_languages', ['id' => $language->id]);
    }
}
