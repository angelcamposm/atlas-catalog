<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\CiProviderInterface;
use App\Exceptions\JenkinsRequestException;
use App\Exceptions\MissingCredentialException;
use App\Http\Clients\JenkinsClientFactory;
use App\Models\CiServer;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;

class JenkinsService implements CiProviderInterface
{
    /**
     * The fields to fetch from the Jenkins API.
     */
    private const array FETCH_TREE = [
        'tree' => 'jobs[name,url,description,displayName,fullDisplayName,_class,buildable]',
    ];

    public function __construct(
        protected JenkinsClientFactory $clientFactory
    ) {}

    /**
     * Fetch jobs from a Jenkins folder or root.
     *
     * @param CiServer $instance
     * @param string|null $folderUrl
     *
     * @return array
     *
     * @throws MissingCredentialException
     * @throws JenkinsRequestException
     */
    public function discoverJobs(CiServer $instance, ?string $folderUrl = null): array
    {
        $credential = $instance->getCredentialOrThrow();
        $apiUrl = $this->buildApiUrl($instance, $folderUrl, '/api/json');

        try {
            $client = $this->clientFactory->create($credential);

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
     * @param CiServer $instance
     * @param string $jobUrl
     * @param array $parameters
     *
     * @return array|null
     *
     * @throws MissingCredentialException
     * @throws JenkinsRequestException
     */
    public function triggerJob(CiServer $instance, string $jobUrl, array $parameters = []): ?array
    {
        $credential = $instance->getCredentialOrThrow();

        $endpoint = empty($parameters) ? "/build" : "/buildWithParameters";
        $url = rtrim($jobUrl, '/') . $endpoint;

        try {
            $client = $this->clientFactory->create($credential);

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
     * Construct the full API URL.
     */
    protected function buildApiUrl(CiServer $instance, ?string $folderUrl, string $suffix): string
    {
        $baseUrl = $folderUrl
            ? rtrim($folderUrl, '/')
            : rtrim($instance->url, '/');

        return $baseUrl . $suffix;
    }
}
