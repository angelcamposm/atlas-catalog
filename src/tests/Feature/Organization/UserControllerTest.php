<?php

declare(strict_types=1);

namespace Tests\Feature\Organization;

use App\Models\User;
use App\Models\Role;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for UserController.
 *
 * Tests CRUD operations for User resources.
 */
class UserControllerTest extends ApiTestCase
{
    #[Test]
    public function test_list_users_returns_paginated_results(): void
    {
        User::factory()->count(15)->create();

        $response = $this->actingAsEditor()
            ->getJson('/api/v1/organization/users');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'created_at', 'updated_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(15, 'data');
    }

    #[Test]
    public function test_create_user_as_admin(): void
    {
        $role = Role::where('slug', 'editor')->first();

        $data = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'role_id' => $role->id,
        ];

        $response = $this->actingAsAdmin()
            ->postJson('/api/v1/organization/users', $data);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'New User');

        $this->assertDatabaseHas('users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
        ]);
    }

    #[Test]
    public function test_create_user_requires_authentication(): void
    {
        $data = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ];

        $response = $this->postJson('/api/v1/organization/users', $data);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_editor_cannot_create_user(): void
    {
        $data = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ];

        $response = $this->actingAsEditor()
            ->postJson('/api/v1/organization/users', $data);

        $response->assertForbidden();
    }

    #[Test]
    public function test_show_user_by_id(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsEditor()
            ->getJson("/api/v1/organization/users/{$user->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $user->id);
    }

    #[Test]
    public function test_update_user_as_admin(): void
    {
        $user = User::factory()->create();

        $data = [
            'name' => 'Updated User Name',
            'email' => 'updated@example.com',
        ];

        $response = $this->actingAsAdmin()
            ->putJson("/api/v1/organization/users/{$user->id}", $data);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated User Name');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated User Name',
        ]);
    }

    #[Test]
    public function test_delete_user_as_admin_only(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsEditor()
            ->deleteJson("/api/v1/organization/users/{$user->id}");

        $response->assertForbidden();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/v1/organization/users/{$user->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    #[Test]
    public function test_show_nonexistent_user_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/organization/users/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_create_user_validates_required_fields(): void
    {
        $response = $this->actingAsAdmin()
            ->postJson('/api/v1/organization/users', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    }

    #[Test]
    public function test_create_user_validates_unique_email(): void
    {
        $existingUser = User::factory()->create();

        $data = [
            'name' => 'Test User',
            'email' => $existingUser->email,
            'password' => 'password',
        ];

        $response = $this->actingAsAdmin()
            ->postJson('/api/v1/organization/users', $data);

        $response->assertUnprocessable();
    }
}
