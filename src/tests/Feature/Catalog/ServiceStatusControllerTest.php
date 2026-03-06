<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\ServiceStatus;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ServiceStatusController (lookup/reference resource).
 */
class ServiceStatusControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        ServiceStatus::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/catalog/service-statuses');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Status'];

        $response = $this->postJson('/api/v1/catalog/service-statuses', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $status = ServiceStatus::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/catalog/service-statuses/{$status->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $status->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $status = ServiceStatus::factory()->create();

        $data = ['name' => 'Updated Status'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/catalog/service-statuses/{$status->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Status');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $status = ServiceStatus::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/catalog/service-statuses/{$status->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('service_statuses', ['id' => $status->id]);
    }
}
