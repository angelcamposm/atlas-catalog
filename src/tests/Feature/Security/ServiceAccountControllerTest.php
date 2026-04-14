<?php

declare(strict_types=1);

namespace Tests\Feature\Security;

use App\Models\ServiceAccount;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for ServiceAccountController.
 *
 * Tests CRUD operations for ServiceAccount resources.
 */
class ServiceAccountControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_service_accounts_returns_paginated_results(): void
    {
        ServiceAccount::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/security/service-accounts');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_create_service_account_as_editor(): void
    {
        $data = [
            'name' => 'ci-cd-bot',
            'description' => 'Service account for CI/CD pipeline',
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/security/service-accounts', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'ci-cd-bot');

        $this->assertDatabaseHas('service_accounts', ['name' => 'ci-cd-bot']);
    }

    #[Test]
    public function test_create_service_account_requires_authentication(): void
    {
        $data = ['name' => 'test-bot'];

        $response = $this->postJson('/api/v1/security/service-accounts', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_service_account_by_id(): void
    {
        $account = ServiceAccount::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/security/service-accounts/{$account->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $account->id);
    }

    #[Test]
    public function test_update_service_account_as_editor(): void
    {
        $account = ServiceAccount::factory()->create();

        $data = [
            'name' => 'updated-bot',
            'description' => 'Updated description',
        ];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/security/service-accounts/{$account->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'updated-bot');

        $this->assertDatabaseHas('service_accounts', [
            'id' => $account->id,
            'name' => 'updated-bot',
        ]);
    }

    #[Test]
    public function test_delete_service_account_as_admin_only(): void
    {
        $account = ServiceAccount::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/security/service-accounts/{$account->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/security/service-accounts/{$account->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('service_accounts', ['id' => $account->id]);
    }

    #[Test]
    public function test_show_nonexistent_service_account_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/security/service-accounts/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_service_account_validates_required_fields(): void
    {
        $response = $this->actingAsEditor()
            ->postJson('/api/v1/security/service-accounts', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_viewer_cannot_create_service_account(): void
    {
        $data = ['name' => 'test-bot'];

        $response = $this->actingAsViewer()
            ->postJson('/api/v1/security/service-accounts', $data);

        $response->assertForbidden();
    }
}
