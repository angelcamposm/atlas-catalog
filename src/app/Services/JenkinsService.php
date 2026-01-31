<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\JenkinsRequestException;
use App\Exceptions\MissingCredentialException;
use App\Models\Credential;
use App\Models\JenkinsInstance;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

final class JenkinsService
{
    /**
     * The fields to fetch from the Jenkins API.
     * This optimizes the payload by only requesting what we need.
     */
    private const array FETCH_TREE = [
        'tree' => 'jobs[name,url,description,displayName,fullDisplayName,_class]',
    ];

    /**
     * Fetch jobs from a Jenkins folder or root.
     *
     * @param JenkinsInstance $instance
     * @param string|null $folderUrl
     *
     * @return array
     *
     * @throws MissingCredentialException
     * @throws JenkinsRequestException
     */
    public function getJobs(JenkinsInstance $instance, ?string $folderUrl = null): array
    {
        $credential = $instance->getCredentialOrThrow();
        $apiUrl = $this->buildApiUrl($instance, $folderUrl, '/api/json');

        try {
            $client = $this->getHttpClient($credential);

            $response = $client->get($apiUrl, self::FETCH_TREE);

            $response->throw();

            return $response->json('jobs') ?? [];

        } catch (RequestException | ConnectionException $exception) {
            throw new JenkinsRequestException(
                message: "Failed to fetch jobs from Jenkins [$instance->name]: {$exception->getMessage()}",
                code: 0,
                previous: $exception
            );
        }
    }

    /**
     * Launch a job on Jenkins.
     *
     * @param JenkinsInstance $instance
     * @param string $jobUrl
     * @param array $parameters
     *
     * @return array|null
     *
     * @throws MissingCredentialException
     * @throws JenkinsRequestException
     */
    public function launchJob(JenkinsInstance $instance, string $jobUrl, array $parameters = []): ?array
    {
        $credential = $instance->getCredentialOrThrow();

        $endpoint = empty($parameters) ? "/build" : "/buildWithParameters";

        // Note: jobUrl usually comes from the API and includes the full path, so we don't use buildApiUrl here
        // unless we want to reconstruct it. Assuming jobUrl is absolute or relative to instance.
        // If jobUrl is absolute (which it is from getJobs), we just append endpoint.
        $url = rtrim($jobUrl, '/') . $endpoint;

        try {
            $client = $this->getHttpClient($credential);

            $response = $client->post($url, $parameters);

            $response->throw();

            return $response->json();

        } catch (RequestException | ConnectionException $exception) {
            throw new JenkinsRequestException(
                message: "Failed to launch job on Jenkins [$instance->name]: {$exception->getMessage()}",
                code: 0,
                previous: $exception
            );
        }
    }

    /**
     * Configure the HTTP client with authentication and defaults.
     */
    private function getHttpClient(Credential $credential): PendingRequest
    {
        return Http::withBasicAuth($credential->identity, $credential->getSecretValue())
            ->acceptJson()
            ->timeout(30)
            ->retry(3, 100);
    }

    /**
     * Construct the full API URL.
     */
    private function buildApiUrl(JenkinsInstance $instance, ?string $folderUrl, string $suffix): string
    {
        $baseUrl = $folderUrl
            ? rtrim($folderUrl, '/')
            : rtrim($instance->url, '/');

        return $baseUrl . $suffix;
    }
}
