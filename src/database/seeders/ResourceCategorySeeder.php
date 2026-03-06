<?php

namespace Database\Seeders;

use App\Models\ResourceCategory;
use Illuminate\Database\Seeder;

/**
 * Application Seeder: Resource Categories — Base Data
 *
 * Creates standard resource categories for infrastructure resources.
 * These are required data, not example data.
 *
 * Idempotent: Uses firstOrCreate to avoid duplicates.
 */
class ResourceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Compute',
                'icon' => 'cpu',
                'color' => '#FF6B6B',
                'description' => 'VMs, containers, serverless compute',
            ],
            [
                'name' => 'Database',
                'icon' => 'database',
                'color' => '#4ECDC4',
                'description' => 'Databases, data warehouses, NoSQL',
            ],
            [
                'name' => 'Storage',
                'icon' => 'hard-drive',
                'color' => '#45B7D1',
                'description' => 'Object storage, file systems, backups',
            ],
            [
                'name' => 'Network',
                'icon' => 'network',
                'color' => '#F7DC6F',
                'description' => 'VPCs, load balancers, CDNs, firewalls',
            ],
            [
                'name' => 'Security',
                'icon' => 'shield',
                'color' => '#BB8FCE',
                'description' => 'Key management, secrets, identity',
            ],
            [
                'name' => 'Messaging',
                'icon' => 'message-square',
                'color' => '#85C1E2',
                'description' => 'Queues, message brokers, pubsub',
            ],
            [
                'name' => 'Monitoring',
                'icon' => 'activity',
                'color' => '#52C41A',
                'description' => 'Monitoring, logging, observability',
            ],
            [
                'name' => 'Integration',
                'icon' => 'link',
                'color' => '#F5A623',
                'description' => 'APIs, event hubs, integration services',
            ],
        ];

        foreach ($categories as $category) {
            ResourceCategory::firstOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
