<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Base class for API feature tests.
 *
 * Provides common setup and helper methods for testing API endpoints with authentication.
 * Includes test users with different roles (admin, editor, viewer) and helper methods
 * for acting as each role or making authenticated requests.
 *
 * @example
 * class ComponentControllerTest extends ApiTestCase {
 *     public function test_list_returns_paginated_results(): void {
 *         $response = $this->actingAsEditor()
 *             ->getJson('/api/v1/catalog/components');
 *         $response->assertOk();
 *     }
 * }
 */
abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user with admin role.
     */
    protected User $adminUser;

    /**
     * Test user with editor role.
     */
    protected User $editorUser;

    /**
     * Test user with viewer role.
     */
    protected User $viewerUser;

    /**
     * Set up test case with test users and roles.
     *
     * Creates three test users with different roles (admin, editor, viewer)
     * using factories. Each user can be used to test role-based access control.
     *
     * The database is refreshed before each test (RefreshDatabase trait).
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Ensure roles exist
        $this->ensureRolesExist();

        // Create test users with different roles
        $this->adminUser = User::factory()->create([
            'email' => 'admin@test.local',
            'name' => 'Admin User',
            'role_id' => Role::where('slug', 'admin')->first()->id,
        ]);

        $this->editorUser = User::factory()->create([
            'email' => 'editor@test.local',
            'name' => 'Editor User',
            'role_id' => Role::where('slug', 'editor')->first()->id,
        ]);

        $this->viewerUser = User::factory()->create([
            'email' => 'viewer@test.local',
            'name' => 'Viewer User',
            'role_id' => Role::where('slug', 'viewer')->first()->id,
        ]);
    }

    /**
     * Ensure all required roles exist in the database.
     *
     * Creates admin, editor, and viewer roles if they don't already exist.
     * This is necessary because tests use RefreshDatabase and need roles for users.
     */
    protected function ensureRolesExist(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Full access to all features and settings',
            ],
            [
                'name' => 'Editor',
                'slug' => 'editor',
                'description' => 'Can create, read, and update content',
            ],
            [
                'name' => 'Viewer',
                'slug' => 'viewer',
                'description' => 'Can only view content',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['slug' => $role['slug']], $role);
        }
    }

    /**
     * Authenticate as an admin user.
     *
     * Sets the test as being authenticated with the admin user via Sanctum.
     * Allows subsequent requests to be made with admin privileges.
     *
     * @return $this
     *
     * @example
     * $response = $this->actingAsAdmin()->deleteJson('/api/v1/catalog/components/1');
     */
    protected function actingAsAdmin(): self
    {
        return $this->actingAs($this->adminUser, 'sanctum');
    }

    /**
     * Authenticate as an editor user.
     *
     * Sets the test as being authenticated with the editor user via Sanctum.
     *
     * @return $this
     *
     * @example
     * $response = $this->actingAsEditor()->postJson('/api/v1/catalog/components', [...]);
     */
    protected function actingAsEditor(): self
    {
        return $this->actingAs($this->editorUser, 'sanctum');
    }

    /**
     * Authenticate as a viewer user.
     *
     * Sets the test as being authenticated with the viewer user via Sanctum.
     *
     * @return $this
     *
     * @example
     * $response = $this->actingAsViewer()->getJson('/api/v1/catalog/components');
     */
    protected function actingAsViewer(): self
    {
        return $this->actingAs($this->viewerUser, 'sanctum');
    }

    /**
     * Assert that the response is unauthorized (401).
     *
     * Helper method for common assertion pattern when testing unauthenticated requests.
     *
     * @return void
     *
     * @example
     * $response = $this->getJson('/api/v1/catalog/components');
     * $response->assertUnauthorized();
     */
    protected function assertResponseUnauthorized($response): void
    {
        $response->assertStatus(401)
            ->assertJsonStructure(['message']);
    }

    /**
     * Assert that the response is forbidden (403).
     *
     * Helper method for common assertion pattern when testing insufficient permissions.
     *
     * @return void
     *
     * @example
     * $response = $this->actingAsViewer()->deleteJson('/api/v1/catalog/components/1');
     * $response->assertForbidden();
     */
    protected function assertResponseForbidden($response): void
    {
        $response->assertStatus(403)
            ->assertJsonStructure(['message']);
    }

    /**
     * Assert that the response is not found (404).
     *
     * Helper method for common assertion pattern when testing non-existent resources.
     *
     * @return void
     *
     * @example
     * $response = $this->getJson('/api/v1/catalog/components/999');
     * $response->assertNotFound();
     */
    protected function assertResourceNotFound($response): void
    {
        $response->assertStatus(404);
    }

    /**
     * Assert that the response has validation errors (422).
     *
     * Helper method for common assertion pattern when testing invalid input.
     *
     * @return void
     *
     * @example
     * $response = $this->actingAsEditor()->postJson('/api/v1/catalog/components', []);
     * $response->assertUnprocessable();
     */
    protected function assertValidationError($response): void
    {
        $response->assertStatus(422)
            ->assertJsonStructure(['errors']);
    }
}
