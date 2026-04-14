<?php

namespace Database\Seeders\Examples;

use Illuminate\Database\Seeder;

/**
 * Example Data Seeder — Development/Demo Data
 *
 * Orchestrates all example data seeders. Run this separately from the
 * base seeders to populate the database with sample data for development
 * and testing.
 *
 * Usage:
 *   php artisan db:seed --class="Database\\Seeders\\Examples\\ExampleDataSeeder"
 *
 * Note: This seeder uses Factories and should only be run in development/staging.
 */
class ExampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create example users with different roles
        $this->call(ExampleUserSeeder::class);

        // Create infrastructure data
        $this->call(ExampleClusterSeeder::class);
        $this->call(ExampleNodeSeeder::class);

        // Create systems and deployments
        $this->call(ExampleSystemSeeder::class);
        $this->call(ExampleReleaseSeeder::class);
        $this->call(ExampleDeploymentSeeder::class);

        // Create CI/CD data
        $this->call(ExampleWorkflowRunSeeder::class);

        // Create organizational data
        $this->call(ExampleServiceAccountSeeder::class);
        $this->call(ExampleLinkSeeder::class);

        $this->command->info('✅ Example data seeding completed.');
    }
}
