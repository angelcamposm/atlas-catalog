<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\CiServer;

interface CiProviderInterface
{
    /**
     * Discover jobs from the CI server.
     *
     * @param CiServer $server
     * @param string|null $resourceId Optional folder or resource ID to scan
     * @return array
     */
    public function discoverJobs(CiServer $server, ?string $resourceId = null): array;

    /**
     * Trigger a job execution.
     *
     * @param CiServer $server
     * @param string $jobId The identifier for the job (URL or ID)
     * @param array $parameters
     * @return array|null
     */
    public function triggerJob(CiServer $server, string $jobId, array $parameters = []): ?array;
}
