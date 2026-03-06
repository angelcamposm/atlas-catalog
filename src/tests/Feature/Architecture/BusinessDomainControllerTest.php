<?php

declare(strict_types=1);

namespace Tests\Feature\Architecture;

use App\Models\BusinessDomain;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for BusinessDomainController.
 *
 * Tests CRUD operations for BusinessDomain resources.
 */
class BusinessDomainControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_business_domains_returns_paginated_results(): void
    {
        BusinessDomain::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/architecture/business-domains');

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
    public function test_create_business_domain_as_editor(): void
    {
        $data = [
            'name' => 'Sales Domain',
            'description' => 'Sales and revenue management',
            'slug' => 'sales-domain',
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/business-domains', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Sales Domain');

        $this->assertDatabaseHas('business_domains', ['name' => 'Sales Domain']);
    }

    #[Test]
    public function test_create_business_domain_requires_authentication(): void
    {
        $data = ['name' => 'Test Domain'];

        $response = $this->postJson('/api/v1/architecture/business-domains', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_business_domain_by_id(): void
    {
        $domain = BusinessDomain::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/architecture/business-domains/{$domain->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $domain->id);
    }

    #[Test]
    public function test_update_business_domain_as_editor(): void
    {
        $domain = BusinessDomain::factory()->create();

        $data = [
            'name' => 'Updated Domain Name',
            'description' => 'Updated description',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/architecture/business-domains/{$domain->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Domain Name');

        $this->assertDatabaseHas('business_domains', [
            'id' => $domain->id,
            'name' => 'Updated Domain Name',
        ]);
    }

    #[Test]
    public function test_delete_business_domain_as_admin_only(): void
    {
        $domain = BusinessDomain::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/architecture/business-domains/{$domain->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/architecture/business-domains/{$domain->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('business_domains', ['id' => $domain->id]);
    }

    #[Test]
    public function test_show_nonexistent_business_domain_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/architecture/business-domains/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_business_domain_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/architecture/business-domains', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_business_domain(): void
    {
        $data = ['name' => 'Test Domain'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/architecture/business-domains', $data);

        $response->assertForbidden();
    }
}
