<?php

namespace Database\Seeders\Examples;

use App\Models\Cluster;
use App\Models\Node;
use Illuminate\Database\Seeder;

/**
 * Example: Cluster Nodes
 *
 * Creates sample nodes distributed across the clusters
 * created in ExampleClusterSeeder.
 */
class ExampleNodeSeeder extends Seeder
{
    public function run(): void
    {
        // Get the clusters created by ExampleClusterSeeder
        $clusters = Cluster::all();

        if ($clusters->isEmpty()) {
            $this->command->warn('⚠️  No clusters found. Run ExampleClusterSeeder first.');
            return;
        }

        foreach ($clusters as $cluster) {
            // Create 3-5 nodes per cluster
            Node::factory()
                ->count(rand(3, 5))
                ->create([
                    'cluster_id' => $cluster->id,
                ]);
        }

        $nodeCount = Node::count();
        $this->command->info("✅ Created {$nodeCount} example nodes across {$clusters->count()} clusters");
    }
}
