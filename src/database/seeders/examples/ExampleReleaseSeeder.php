<?php

namespace Database\Seeders\Examples;

use App\Models\Release;
use Illuminate\Database\Seeder;

/**
 * Example: Releases
 *
 * Creates sample software releases for tracking version
 * history and associated deployments.
 */
class ExampleReleaseSeeder extends Seeder
{
    public function run(): void
    {
        $releases = [
            [
                'version' => '1.0.0',
                'description' => 'Initial production release with core features',
                'release_date' => now()->subMonths(6),
            ],
            [
                'version' => '1.1.0',
                'description' => 'Added payment gateway integration and improved UI',
                'release_date' => now()->subMonths(5),
            ],
            [
                'version' => '1.2.0',
                'description' => 'Performance optimizations and bug fixes',
                'release_date' => now()->subMonths(3),
            ],
            [
                'version' => '2.0.0',
                'description' => 'Major redesign with new architecture and features',
                'release_date' => now()->subMonths(1),
            ],
            [
                'version' => '2.0.1',
                'description' => 'Hotfix for critical security issue',
                'release_date' => now()->subWeek(),
            ],
            [
                'version' => '2.1.0',
                'description' => 'New analytics dashboard and mobile app support',
                'release_date' => now(),
            ],
        ];

        foreach ($releases as $release) {
            Release::factory()->create($release);
        }

        $this->command->info('✅ Created 6 example releases');
    }
}
