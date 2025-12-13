<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->create_initial_user();
        $this->run_base_seeders();
    }

    private function create_initial_user(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ],
        );
    }

    private function run_base_seeders(): void
    {
        // First-level models
        $this->call([
            ApiAccessPolicySeeder::class,
            ApiStatusSeeder::class,
            ApiTypeSeeder::class,
            AuthenticationMethodSeeder::class,
            BusinessDomainSeeder::class,
            BusinessTierSeeder::class,
            CategorySeeder::class,
            ComplianceStandardSeeder::class,
            EnvironmentSeeder::class,
            InfrastructureTypeSeeder::class,
            LifecycleSeeder::class,
            ProgrammingLanguageSeeder::class,
            GroupMemberRoleSeeder::class,
            GroupTypeSeeder::class,
            VendorSeeder::class,
        ]);

        // Second-level models (models that depend on another model)
        $this->call([
            ClusterTypeSeeder::class,
            FrameworkSeeder::class,
        ]);
    }
}
