<?php

declare(strict_types=1);

namespace Tests\Feature\Operations;

use App\Models\Cluster;
use App\Models\Deployment;
use App\Models\Environment;
use App\Models\WorkflowRun;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for DeploymentController.
 *
 * Tests the currently exposed CI/CD deployment routes.
 */
class DeploymentControllerTest extends ApiTestCase
{
    private const CI_CD_DEPLOYMENTS_ENDPOINT = '/api/v1/ci-cd/deployments';

    #[Test]
    public function test_list_deployments_returns_paginated_results(): void
    {
        $this->createDeployment();
        $this->createDeployment([
            'status' => 'success',
        ]);
        $this->createDeployment([
            'status' => 'failed',
        ]);

        $response = $this->actingAsEditor()
            ->getJson(self::CI_CD_DEPLOYMENTS_ENDPOINT);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'component_id', 'environment_id', 'status', 'started_at'],
                ],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(3, 'data');
    }

    #[Test]
    public function test_list_deployments_requires_authentication(): void
    {
        $response = $this->getJson(self::CI_CD_DEPLOYMENTS_ENDPOINT);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_deployment_by_id(): void
    {
        $deployment = $this->createDeployment();

        $response = $this->actingAsEditor()
            ->getJson(self::CI_CD_DEPLOYMENTS_ENDPOINT."/{$deployment->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $deployment->id)
            ->assertJsonPath('data.component_id', $deployment->component_id)
            ->assertJsonPath('data.environment_id', $deployment->environment_id);
    }

    #[Test]
    public function test_update_deployment_as_editor(): void
    {
        $deployment = $this->createDeployment([
            'started_at' => Carbon::parse('2026-03-07 10:00:00'),
            'meta' => ['existing' => 'value'],
        ]);

        $response = $this->actingAsEditor()
            ->putJson(self::CI_CD_DEPLOYMENTS_ENDPOINT."/{$deployment->id}", [
                'status' => 'success',
                'ended_at' => '2026-03-07 10:00:05',
                'meta' => [
                    'summary' => 'Deployment successful',
                ],
            ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'success')
            ->assertJsonPath('data.duration_milliseconds', 5000)
            ->assertJsonPath('data.meta.existing', 'value')
            ->assertJsonPath('data.meta.summary', 'Deployment successful');

        $this->assertDatabaseHas('deployments', [
            'id' => $deployment->id,
            'status' => 'success',
            'duration_milliseconds' => 5000,
        ]);
    }

    #[Test]
    public function test_update_deployment_requires_authentication(): void
    {
        $deployment = $this->createDeployment();

        $response = $this->putJson(self::CI_CD_DEPLOYMENTS_ENDPOINT."/{$deployment->id}", [
            'status' => 'success',
        ]);

        $response->assertUnauthorized();
    }

    #[Test]
    public function test_show_nonexistent_deployment_returns_404(): void
    {
        $response = $this->actingAsEditor()
            ->getJson(self::CI_CD_DEPLOYMENTS_ENDPOINT.'/9999');

        $response->assertNotFound();
    }

    #[Test]
    public function test_update_deployment_validates_required_fields(): void
    {
        $deployment = $this->createDeployment();

        $response = $this->actingAsEditor()
            ->putJson(self::CI_CD_DEPLOYMENTS_ENDPOINT."/{$deployment->id}", []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    #[Test]
    public function test_create_route_is_not_exposed_for_ci_cd_deployments(): void
    {
        $response = $this->actingAsAdmin()
            ->postJson(self::CI_CD_DEPLOYMENTS_ENDPOINT, [
                'status' => 'pending',
            ]);

        $this->assertContains($response->status(), [404, 405]);
    }

    #[Test]
    public function test_delete_route_is_not_exposed_for_ci_cd_deployments(): void
    {
        $deployment = $this->createDeployment();

        $response = $this->actingAsAdmin()
            ->deleteJson(self::CI_CD_DEPLOYMENTS_ENDPOINT."/{$deployment->id}");

        $this->assertContains($response->status(), [404, 405]);
    }

    private function createDeployment(array $overrides = []): Deployment
    {
        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        return Deployment::create(array_merge([
            'component_id' => $workflowRun->workflowJob->component_id,
            'environment_id' => $environment->id,
            'cluster_id' => Cluster::factory()->create()->id,
            'status' => 'pending',
            'started_at' => Carbon::parse('2026-03-07 09:59:00'),
        ], $overrides));
    }
}
