<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\SyncJenkinsFolderJob;
use App\Models\JenkinsInstance;
use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'jenkins:sync-workflows')]
class JenkinsSyncWorkflowsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jenkins:sync-workflows {instance? : The ID or Name of the Jenkins instance to sync}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Discover WorkflowJobs from Jenkins instances.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $instanceIdentifier = $this->argument('instance');

        $query = JenkinsInstance::where('is_enabled', true);

        if ($instanceIdentifier) {
            $query->where(function ($q) use ($instanceIdentifier) {
                $q->where('id', $instanceIdentifier)
                  ->orWhere('name', $instanceIdentifier);
            });
        }

        $instances = $query->get();

        if ($instances->isEmpty()) {
            if ($instanceIdentifier) {
                $this->error("No enabled Jenkins instance found matching: $instanceIdentifier");
                return self::FAILURE;
            }

            $this->info('No enabled Jenkins instances found.');

            return self::SUCCESS;
        }

        foreach ($instances as $instance) {
            $this->info("Dispatching sync for instance: $instance->name ($instance->url)");

            // Dispatch the root crawler
            SyncJenkinsFolderJob::dispatch($instance, null);
        }

        $this->info('All sync jobs dispatched to the queue.');

        return self::SUCCESS;
    }
}
