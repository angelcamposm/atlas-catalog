<?php

namespace Database\Seeders\Examples;

use App\Models\Component;
use App\Models\Deployment;
use App\Models\Environment;
use App\Models\Release;
use Illuminate\Database\Seeder;

/**
 * Example: Deployments
 *
 * Creates sample deployments linking components, releases,
 * and environments together.
 */
class ExampleDeploymentSeeder extends Seeder
{
    public function run(): void
    {
        $components = Component::limit(10)->get();
        $releases = Release::all();
        $environments = Environment::all();

        if ($components->isEmpty() || $releases->isEmpty() || $environments->isEmpty()) {
            $this->command->warn('⚠️  Missing required data (Components, Releases, or Environments)');
            return;
        }

        $count = 0;

        foreach ($components as $component) {
            // Create 2-3 deployments per component
            foreach (range(1, rand(2, 3)) as $i) {
                Deployment::factory()->create([
                    'component_id' => $component->id,
                    'release_id' => $releases->random()->id,
                    'environment_id' => $environments->random()->id,
                ]);
                $count++;
            }
        }

        $this->command->info("✅ Created {$count} example deployments");
    }
}
