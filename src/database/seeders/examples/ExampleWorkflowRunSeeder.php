<?php

namespace Database\Seeders\Examples;

use App\Models\Release;
use App\Models\WorkflowRun;
use Illuminate\Database\Seeder;

/**
 * Example: Workflow Runs
 *
 * Creates sample CI/CD workflow runs showing execution
 * history and status for tracking deployment automation.
 */
class ExampleWorkflowRunSeeder extends Seeder
{
    public function run(): void
    {
        $releases = Release::all();

        if ($releases->isEmpty()) {
            $this->command->warn('⚠️  No releases found. Run ExampleReleaseSeeder first.');
            return;
        }

        $count = 0;

        foreach ($releases as $release) {
            // Create 1-3 workflow runs per release
            foreach (range(1, rand(1, 3)) as $i) {
                $startTime = now()->subDays(rand(1, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));

                WorkflowRun::factory()->create([
                    'release_id' => $release->id,
                    'started_at' => $startTime,
                    'completed_at' => $startTime->addMinutes(rand(5, 60)),
                ]);
                $count++;
            }
        }

        $this->command->info("✅ Created {$count} example workflow runs");
    }
}
