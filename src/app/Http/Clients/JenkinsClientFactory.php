<?php

declare(strict_types=1);

namespace App\Http\Clients;

use App\Models\Credential;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class JenkinsClientFactory
{
    /**
     * Create a configured HTTP client for Jenkins.
     */
    public function create(Credential $credential): PendingRequest
    {
        return Http::withBasicAuth($credential->identity, $credential->getSecretValue())
            ->acceptJson()
            ->timeout(30)
            ->retry(3, 100);
    }
}
