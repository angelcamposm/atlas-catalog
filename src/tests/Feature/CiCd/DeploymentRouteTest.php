<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DeploymentRouteTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_deployments_from_the_ci_cd_domain(): void
    {
        $response = $this->getJson('/api/v1/ci-cd/deployments');

        $response
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
