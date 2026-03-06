<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\Vendor;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for VendorController (lookup/reference resource).
 */
class VendorControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        Vendor::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/vendors');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Vendor'];

        $response = $this->postJson('/api/v1/catalog/vendors', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $vendor = Vendor::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/vendors/{$vendor->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $vendor->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $vendor = Vendor::factory()->create();

        $data = ['name' => 'Updated Vendor'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/vendors/{$vendor->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Vendor');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $vendor = Vendor::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/vendors/{$vendor->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('vendors', ['id' => $vendor->id]);
    }
}
