<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Models\ComplianceStandard;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ComplianceStandardController (lookup/reference resource).
 */
class ComplianceStandardControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        ComplianceStandard::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/compliance/standards');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Standard'];

        $response = $this->postJson('/api/v1/compliance/standards', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $standard = ComplianceStandard::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/compliance/standards/{$standard->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $standard->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $standard = ComplianceStandard::factory()->create();

        $data = ['name' => 'Updated Standard'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/compliance/standards/{$standard->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Standard');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $standard = ComplianceStandard::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/compliance/standards/{$standard->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('compliance_standards', ['id' => $standard->id]);
    }
}
