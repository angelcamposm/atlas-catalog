<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

use App\Models\Deployment;
use App\Models\Environment;
use App\Models\WorkflowJob;
use App\Models\WorkflowRun;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestWith;
use Tests\Feature\ApiTestCase;

/**
 * Feature tests for DeploymentWebhookController.
 *
 * Tests webhook endpoint for receiving deployment events from CI/CD systems.
 *
 * Endpoints tested:
 * - POST /v1/webhooks/deployments (create from webhook payload)
 */
class DeploymentWebhookControllerTest extends ApiTestCase
{
    private const WEBHOOK_ENDPOINT = '/api/v1/webhooks/deployments';

    private const FINISHED_AT = '2026-03-06 10:05:00';

    private const DEPLOYMENT_LOGS = 'Deployment completed successfully.';

    #[Test]
    public function test_webhook_requires_authentication_token(): void
    {
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');

        // Act: Send webhook request without token
        $response = $this->postJson(self::WEBHOOK_ENDPOINT, [
            'workflow_run_id' => 1,
            'environment_id' => 1,
            'status' => 'success',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_webhook_with_invalid_token_is_rejected(): void
    {
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');

        // Act: Send webhook request with invalid token
        $response = $this->withHeader('X-Webhook-Token', 'invalid-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => 1,
                'environment_id' => 1,
                'status' => 'success',
            ]);

        // Assert
        $response->assertUnauthorized();
    }

    #[Test]
    public function test_webhook_with_valid_token_succeeds(): void
    {
        // Arrange
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');
        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        // Act: Send webhook request with valid token
        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
                'started_at' => '2026-03-06 10:00:00',
                'finished_at' => self::FINISHED_AT,
            ]);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure([
                'data' => ['id', 'status', 'workflow_run_id', 'environment_id'],
            ]);

        $this->assertDatabaseHas('deployments', [
            'workflow_run_id' => $workflowRun->id,
            'environment_id' => $environment->id,
            'status' => 'success',
        ]);
    }

    #[Test]
    public function test_webhook_validates_required_fields(): void
    {
        // Arrange
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');

        // Act: Send webhook request missing required fields
        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'status' => 'success',
                // Missing workflow_run_id and environment_id
            ]);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['workflow_run_id', 'environment_id']);
    }

    #[Test]
    public function test_webhook_validates_status_enum(): void
    {
        // Arrange
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');
        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        // Act: Send webhook request with invalid status
        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'invalid-status',
            ]);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    #[Test]
    public function test_webhook_validates_foreign_keys(): void
    {
        // Arrange
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');

        // Act: Send webhook request with non-existent IDs
        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => 99999,
                'environment_id' => 99999,
                'status' => 'success',
            ]);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['workflow_run_id', 'environment_id']);
    }

    #[Test]
    public function test_webhook_accepts_optional_metadata(): void
    {
        // Arrange
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');
        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        // Act: Send webhook request with optional metadata
        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
                'metadata' => [
                    'build_id' => 'jenkins-123',
                    'commit_hash' => 'abc123',
                ],
                'logs' => self::DEPLOYMENT_LOGS,
            ]);

        // Assert
        $response->assertCreated();

        $this->assertDatabaseHas('deployments', [
            'workflow_run_id' => $workflowRun->id,
            'environment_id' => $environment->id,
        ]);
    }

    #[Test]
    public function test_webhook_updates_existing_deployment(): void
    {
        // Arrange
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');
        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        // Create a deployment with initial status
        Deployment::create([
            'component_id' => $workflowRun->workflowJob->component_id,
            'workflow_run_id' => $workflowRun->id,
            'environment_id' => $environment->id,
            'status' => 'pending',
        ]);

        // Act: Send webhook request to update status
        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
                'finished_at' => self::FINISHED_AT,
            ]);

        // Assert
        $response->assertOk();

        $this->assertDatabaseHas('deployments', [
            'workflow_run_id' => $workflowRun->id,
            'environment_id' => $environment->id,
            'status' => 'success',
        ]);

        // Should still have only 1 deployment record
        $this->assertEquals(1, Deployment::count());
    }

    #[Test]
    public function test_webhook_maps_payload_to_deployment_schema_fields(): void
    {
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');

        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
                'started_at' => '2026-03-06 10:00:00',
                'finished_at' => self::FINISHED_AT,
                'metadata' => [
                    'build_id' => 'jenkins-123',
                    'commit_hash' => 'abc123',
                ],
            ]);

        $response->assertCreated();

        $deployment = Deployment::query()
            ->where('workflow_run_id', $workflowRun->id)
            ->where('environment_id', $environment->id)
            ->first();

        $this->assertNotNull($deployment);
        $this->assertSame($workflowRun->workflowJob->component_id, $deployment->component_id);
        $this->assertSame(self::FINISHED_AT, $deployment->ended_at?->format('Y-m-d H:i:s'));
        $this->assertSame([
            'build_id' => 'jenkins-123',
            'commit_hash' => 'abc123',
        ], $deployment->meta);
    }

    #[Test]
    public function test_webhook_normalizes_running_status_to_in_progress(): void
    {
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');

        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'running',
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('deployments', [
            'workflow_run_id' => $workflowRun->id,
            'environment_id' => $environment->id,
            'status' => 'in_progress',
        ]);
    }

    #[Test]
    #[TestWith(['failed'])]
    #[TestWith(['cancelled'])]
    public function test_webhook_persists_terminal_statuses(string $status): void
    {
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');

        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => $status,
                'finished_at' => self::FINISHED_AT,
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('deployments', [
            'workflow_run_id' => $workflowRun->id,
            'environment_id' => $environment->id,
            'status' => $status,
        ]);
    }

    #[Test]
    public function test_webhook_merges_metadata_when_updating_existing_deployment(): void
    {
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');

        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        Deployment::create([
            'component_id' => $workflowRun->workflowJob->component_id,
            'workflow_run_id' => $workflowRun->id,
            'environment_id' => $environment->id,
            'status' => 'pending',
            'meta' => [
                'existing' => 'keep',
                'commit_hash' => 'old-value',
            ],
        ]);

        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
                'metadata' => [
                    'commit_hash' => 'new-value',
                    'build_id' => 'jenkins-123',
                ],
                'logs' => self::DEPLOYMENT_LOGS,
            ]);

        $response->assertOk();

        $deployment = Deployment::query()
            ->where('workflow_run_id', $workflowRun->id)
            ->where('environment_id', $environment->id)
            ->sole();

        $this->assertSame([
            'existing' => 'keep',
            'commit_hash' => 'new-value',
            'build_id' => 'jenkins-123',
            'logs' => self::DEPLOYMENT_LOGS,
        ], $deployment->meta);
    }

    #[Test]
    public function test_webhook_rejects_workflow_run_without_component_context(): void
    {
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');

        $workflowJob = WorkflowJob::factory()->create([
            'component_id' => null,
        ]);

        $workflowRun = WorkflowRun::factory()->create([
            'workflow_job_id' => $workflowJob->id,
        ]);

        $environment = Environment::factory()->create();

        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['workflow_run_id']);

        $this->assertDatabaseMissing('deployments', [
            'workflow_run_id' => $workflowRun->id,
            'environment_id' => $environment->id,
        ]);
    }

    #[Test]
    public function test_webhook_respects_rate_limiting(): void
    {
        // Arrange
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');
        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        // Act: Send multiple rapid requests (simulating rate limiting)
        for ($i = 0; $i < 120; $i++) {
            $this->withServerVariables(['REMOTE_ADDR' => '10.10.10.10'])
                ->withHeader('X-Webhook-Token', 'test-secret-token')
                ->postJson(self::WEBHOOK_ENDPOINT, [
                    'workflow_run_id' => $workflowRun->id,
                    'environment_id' => $environment->id,
                    'status' => 'success',
                ]);
        }

        $response = $this->withServerVariables(['REMOTE_ADDR' => '10.10.10.10'])
            ->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
            ]);

        $response->assertTooManyRequests();
    }

    #[Test]
    public function test_webhook_accepts_rolled_back_status(): void
    {
        // Arrange
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');
        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        // Act: Send webhook with rolled_back (was missing from old hardcoded allowlist)
        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson(self::WEBHOOK_ENDPOINT, [
                'workflow_run_id' => $workflowRun->id,
                'environment_id'  => $environment->id,
                'status'          => 'rolled_back',
                'finished_at'     => self::FINISHED_AT,
            ]);

        // Assert: 201 and correctly persisted
        $response->assertCreated();

        $this->assertDatabaseHas('deployments', [
            'workflow_run_id' => $workflowRun->id,
            'environment_id'  => $environment->id,
            'status'          => 'rolled_back',
        ]);
    }
}
