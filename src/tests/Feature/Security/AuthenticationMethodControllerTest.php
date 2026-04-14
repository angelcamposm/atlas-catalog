<?php

declare(strict_types=1);

namespace Tests\Feature\Security;

use App\Models\AuthenticationMethod;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for AuthenticationMethodController (lookup/reference resource).
 */
class AuthenticationMethodControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_returns_paginated_results(): void
    {
        AuthenticationMethod::factory()->count(10)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/security/authentication-methods');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    #[Test]
    public function test_create_requires_authentication(): void
    {
        $data = ['name' => 'Test Method'];

        $response = $this->postJson('/api/v1/security/authentication-methods', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_returns_resource(): void
    {
        $method = AuthenticationMethod::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/security/authentication-methods/{$method->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $method->id);
    }

    #[Test]
    public function test_update_works_for_editor(): void
    {
        $method = AuthenticationMethod::factory()->create();

        $data = ['name' => 'Updated Method'];

        $response = $this->actingAsEditor()
            ->putJson("/api/v1/security/authentication-methods/{$method->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Method');
    }

    #[Test]
    public function test_delete_works_for_admin(): void
    {
        $method = AuthenticationMethod::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/security/authentication-methods/{$method->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('authentication_methods', ['id' => $method->id]);
    }
}
