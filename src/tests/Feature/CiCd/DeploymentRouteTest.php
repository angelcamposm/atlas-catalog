<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

class DeploymentRouteTest extends ApiTestCase
{
    #[Test]
    public function it_requires_authentication_to_list_deployments_from_the_ci_cd_domain(): void
    {
        $response = $this->getJson('/api/v1/ci-cd/deployments');

        $response->assertUnauthorized();
    }

    #[Test]
    public function it_lists_deployments_from_the_ci_cd_domain_for_authenticated_users(): void
    {
        $response = $this->actingAsEditor()
            ->getJson('/api/v1/ci-cd/deployments');

        $response
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
