<?php

namespace Database\Seeders;

use App\Models\Api;
use App\Models\ApiAccessPolicy;
use App\Models\ApiStatus;
use App\Models\ApiType;
use App\Models\AuthenticationMethod;
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
        $this->create_sample_data();
    }

    private function run_base_seeders(): void
    {
        $this->call([
            ApiAccessPolicySeeder::class,
            ApiStatusSeeder::class,
            ApiTypeSeeder::class,
            AuthenticationMethodSeeder::class,
            BusinessDomainSeeder::class,
            BusinessTierSeeder::class,
            LifecycleSeeder::class,
            ProgrammingLanguageSeeder::class,
            FrameworkSeeder::class,
            ResourceTypeSeeder::class,
            VendorSeeder::class,
        ]);
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

    /**
     * Creates sample API data for development environments by reusing existing relations.
     */
    private function create_sample_data(): void
    {
        if (app()->isProduction()) {
            return;
        }

        // Reuse existing related models to avoid creating new ones for each API.
        $accessPolicyIds = ApiAccessPolicy::pluck('id');
        $statusIds = ApiStatus::pluck('id');
        $typeIds = ApiType::pluck('id');
        $authMethodIds = AuthenticationMethod::pluck('id');

        // Ensure base seeders have run and we have data to link.
        if ($accessPolicyIds->isEmpty() || $statusIds->isEmpty() || $typeIds->isEmpty() || $authMethodIds->isEmpty()) {
            if (app()->runningInConsole()) {
                $this->command->warn('One or more base tables are empty. Skipping API sample data creation.');
            }
            return;
        }

        Api::factory()
            ->count(50)
            ->sequence(fn () => [
                'access_policy_id' => $accessPolicyIds->random(),
                'authentication_method_id' => $authMethodIds->random(),
                'status_id' => $statusIds->random(),
                'type_id' => $typeIds->random(),
            ])
            ->create();
    }
}
