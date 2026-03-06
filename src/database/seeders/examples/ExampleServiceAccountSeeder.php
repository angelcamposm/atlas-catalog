<?php

namespace Database\Seeders\Examples;

use App\Models\ServiceAccount;
use Illuminate\Database\Seeder;

/**
 * Example: Service Accounts
 *
 * Creates sample service accounts for testing API
 * authentication and programmatic access.
 */
class ExampleServiceAccountSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'name' => 'ci-cd-bot',
                'description' => 'CI/CD pipeline automation service account',
                'is_active' => true,
            ],
            [
                'name' => 'monitoring-service',
                'description' => 'Monitoring and alerting system',
                'is_active' => true,
            ],
            [
                'name' => 'backup-automation',
                'description' => 'Automated backup and restore service',
                'is_active' => true,
            ],
            [
                'name' => 'migration-tool',
                'description' => 'Database migration and sync tool',
                'is_active' => false,
            ],
        ];

        foreach ($accounts as $account) {
            ServiceAccount::factory()->create($account);
        }

        $this->command->info('✅ Created 4 example service accounts');
    }
}
