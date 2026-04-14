<?php

declare(strict_types=1);

namespace Tests\Feature\Architecture;

use App\Models\System;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for SystemController.
 *
 * Tests CRUD operations for System resources.
 */
class SystemControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_systems_returns_paginated_results(): void
    {
        System::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/architecture/systems');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_create_system_as_editor(): void
    {
        $data = [
            'name' => 'E-Commerce System',
            'description' => 'Main e-commerce platform',
            'slug' => 'ecommerce-system',
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/systems', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'E-Commerce System');

        $this->assertDatabaseHas('systems', ['name' => 'E-Commerce System']);
    }

    #[Test]
    public function test_create_system_requires_authentication(): void
    {
        $data = ['name' => 'Test System'];

        $response = $this->postJson('/api/v1/architecture/systems', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_system_by_id(): void
    {
        $system = System::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/architecture/systems/{$system->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $system->id);
    }

    #[Test]
    public function test_update_system_as_editor(): void
    {
        $system = System::factory()->create();

        $data = [
            'name' => 'Updated System Name',
            'description' => 'Updated description',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/architecture/systems/{$system->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated System Name');

        $this->assertDatabaseHas('systems', [
            'id' => $system->id,
            'name' => 'Updated System Name',
        ]);
    }

    #[Test]
    public function test_delete_system_as_admin_only(): void
    {
        $system = System::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/architecture/systems/{$system->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/architecture/systems/{$system->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('systems', ['id' => $system->id]);
    }

    #[Test]
    public function test_show_nonexistent_system_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/architecture/systems/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_system_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/systems', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_system(): void
    {
        $data = ['name' => 'Test System'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/architecture/systems', $data);

        $response->assertForbidden();
    }
}
