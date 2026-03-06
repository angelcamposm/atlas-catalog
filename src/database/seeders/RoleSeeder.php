<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

final class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}
