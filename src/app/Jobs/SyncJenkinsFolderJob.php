<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\JenkinsClasses;
use App\Models\JenkinsInstance;
use App\Models\WorkflowJob;
use App\Services\JenkinsService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class SyncJenkinsFolderJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * The Jenkins instance to be crawled.
     */
    public JenkinsInstance $instance;

    /**
     * The URL of the folder to scan. If null, scans root.
     */
    public ?string $folderUrl;


    /**
     * Create a new job instance.
     */
    public function __construct(JenkinsInstance $instance, ?string $folderUrl = null)
    {
        $this->instance = $instance;
        $this->folderUrl = $folderUrl;
    }

    /**
     * Execute the job.
     */
    public function handle(JenkinsService $jenkinsService): void
    {
        Log::info("Syncing Jenkins Folder", [
            'instance' => $this->instance->name,
            'url' => $this->folderUrl ?? 'ROOT'
        ]);

        try {
            $items = $jenkinsService->discoverJobs($this->instance, $this->folderUrl);

            foreach ($items as $item) {

                $class = $item['_class'] ?? '';
                $url = $item['url'];

                // Case A: It is a Folder (Standard or Multibranch)
                if (JenkinsClasses::isFolder($class)) {
                    // Recursively dispatch a new job for this folder
                    self::dispatch($this->instance, $url);
                }
                // Case B: It is a Workflow Job (Pipeline)
                elseif (JenkinsClasses::isPipeline($class)) {
                    $this->syncWorkflowJob($item);
                }
            }

            // Update the instance timestamp if this was the root job
            if ($this->folderUrl === null) {
                $this->instance->update(['last_synced_at' => Carbon::now()]);
            }

        } catch (Exception $e) {
            Log::error("Failed to sync Jenkins folder", [
                'instance' => $this->instance->name,
                'url' => $this->folderUrl,
                'error' => $e->getMessage()
            ]);

            // Fail the job so it can be retried or inspected
            $this->fail($e);
        }
    }

    private function syncWorkflowJob(array $item): void
    {
        Log::info(
            "Syncing WorkflowJob",
            [
                'instance' => $this->instance->name,
                'url' => $item['url'],
                'name' => $item['name'],
            ]
        );

        WorkflowJob::updateOrCreate(
            [
                'ci_server_id' => $this->instance->id,
                'url' => $item['url'],
            ],
            [
                'name' => $item['name'],
                'display_name' => $item['displayName'] ?? $item['name'],
                'description' => $item['description'] ?? null,
                'discovery_source' => 'jenkins',
                'is_enabled' => $item['buildable'],
                'last_synced_at' => Carbon::now(),
                // Note: component_id is not set here. It must be linked manually or via another heuristic.
                'component_id' => null
            ]
        );
    }
}
