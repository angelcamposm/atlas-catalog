<?php

namespace Database\Seeders\Examples;

use App\Models\System;
use Illuminate\Database\Seeder;

/**
 * Example: Systems
 *
 * Creates sample systems that group components together
 * for domain/business capability organization.
 */
class ExampleSystemSeeder extends Seeder
{
    public function run(): void
    {
        $systems = [
            [
                'name' => 'payment-platform',
                'display_name' => 'Payment Platform',
                'description' => 'Core payment processing and settlement system',
            ],
            [
                'name' => 'user-management',
                'display_name' => 'User Management',
                'description' => 'User authentication, authorization, and profile management',
            ],
            [
                'name' => 'inventory-system',
                'display_name' => 'Inventory System',
                'description' => 'Stock tracking, warehouse management, and fulfillment',
            ],
            [
                'name' => 'analytics-service',
                'display_name' => 'Analytics Service',
                'description' => 'Data collection, processing, and reporting',
            ],
            [
                'name' => 'notification-hub',
                'display_name' => 'Notification Hub',
                'description' => 'Email, SMS, and push notification delivery',
            ],
        ];

        foreach ($systems as $system) {
            System::factory()->create($system);
        }

        $this->command->info('✅ Created 5 example systems');
    }
}
