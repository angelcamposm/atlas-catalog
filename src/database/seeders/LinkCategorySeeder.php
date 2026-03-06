<?php

namespace Database\Seeders;

use App\Models\LinkCategory;
use Illuminate\Database\Seeder;

/**
 * Application Seeder: Link Categories — Base Data
 *
 * Creates standard link categories used throughout the system.
 * These are required data, not example data.
 *
 * Idempotent: Uses firstOrCreate to avoid duplicates.
 */
class LinkCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Documentation',
                'description' => 'Links to project documentation and guides',
            ],
            [
                'name' => 'Repository',
                'description' => 'Source code repositories (GitHub, GitLab, etc)',
            ],
            [
                'name' => 'Dashboard',
                'description' => 'Monitoring and admin dashboards',
            ],
            [
                'name' => 'CI/CD',
                'description' => 'Continuous Integration and Deployment pipelines',
            ],
            [
                'name' => 'Monitoring',
                'description' => 'Monitoring, logging, and APM services',
            ],
            [
                'name' => 'Support',
                'description' => 'Support channels and on-call management',
            ],
            [
                'name' => 'API',
                'description' => 'API documentation and endpoints',
            ],
        ];

        foreach ($categories as $category) {
            LinkCategory::firstOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
