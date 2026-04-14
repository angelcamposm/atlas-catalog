<?php

namespace Database\Seeders\Examples;

use App\Models\Cluster;
use App\Models\ClusterType;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

/**
 * Example: Infrastructure Clusters
 *
 * Creates sample Kubernetes clusters with different types
 * and vendors for infrastructure testing.
 */
class ExampleClusterSeeder extends Seeder
{
    public function run(): void
    {
        $kubeType = ClusterType::where('name', 'Kubernetes')->first();
        $eksVendor = Vendor::where('name', 'AWS')->first();
        $gkeVendor = Vendor::where('name', 'Google Cloud')->first();
        $azureVendor = Vendor::where('name', 'Microsoft Azure')->first();

        // Create EKS cluster
        Cluster::factory()->create([
            'name' => 'prod-eks-us-east-1',
            'display_name' => 'Production EKS (US East)',
            'cluster_type_id' => $kubeType?->id,
            'vendor_id' => $eksVendor?->id,
        ]);

        // Create GKE cluster
        Cluster::factory()->create([
            'name' => 'staging-gke-us-central-1',
            'display_name' => 'Staging GKE (US Central)',
            'cluster_type_id' => $kubeType?->id,
            'vendor_id' => $gkeVendor?->id,
        ]);

        // Create AKS cluster
        Cluster::factory()->create([
            'name' => 'dev-aks-eastus',
            'display_name' => 'Development AKS (East US)',
            'cluster_type_id' => $kubeType?->id,
            'vendor_id' => $azureVendor?->id,
        ]);

        $this->command->info('✅ Created 3 example clusters (EKS, GKE, AKS)');
    }
}
