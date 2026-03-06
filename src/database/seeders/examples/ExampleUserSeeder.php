<?php

namespace Database\Seeders\Examples;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Example: Users with Different Roles
 *
 * Creates sample users for development and testing.
 * Assigns different roles (admin, editor, viewer) for testing
 * authorization and access control.
 */
class ExampleUserSeeder extends Seeder
{
    public function run(): void
    {
        // Get roles (created by RoleSeeder in base migration)
        $adminRole = Role::where('name', 'admin')->first();
        $editorRole = Role::where('name', 'editor')->first();
        $viewerRole = Role::where('name', 'viewer')->first();

        // Create example admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@atlas.local',
            'role_id' => $adminRole?->id,
        ]);

        // Create example editor users
        User::factory(3)->create([
            'role_id' => $editorRole?->id,
        ]);

        // Create example viewer users
        User::factory(5)->create([
            'role_id' => $viewerRole?->id,
        ]);

        $this->command->info('✅ Created 9 example users (1 admin, 3 editors, 5 viewers)');
    }
}
