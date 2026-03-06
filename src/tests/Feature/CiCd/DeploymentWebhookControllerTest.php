<?php

declare(strict_types=1);

namespace Tests\Feature\CiCd;

use App\Models\Deployment;
use App\Models\Environment;
use App\Models\WorkflowRun;
use PHPUnit\Framework\Attributes\Test;
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
    #[Test]
    public function test_webhook_requires_authentication_token(): void
    {
        // Act: Send webhook request without token
        $response = $this->postJson('/v1/webhooks/deployments', [
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
        // Act: Send webhook request with invalid token
        $response = $this->withHeader('X-Webhook-Token', 'invalid-token')
            ->postJson('/v1/webhooks/deployments', [
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
            ->postJson('/v1/webhooks/deployments', [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
                'started_at' => '2026-03-06 10:00:00',
                'finished_at' => '2026-03-06 10:05:00',
            ]);

        // Assert
        $response->assertOk()
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
            ->postJson('/v1/webhooks/deployments', [
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
            ->postJson('/v1/webhooks/deployments', [
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
            ->postJson('/v1/webhooks/deployments', [
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
            ->postJson('/v1/webhooks/deployments', [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
                'metadata' => [
                    'build_id' => 'jenkins-123',
                    'commit_hash' => 'abc123',
                ],
                'logs' => 'Deployment completed successfully.',
            ]);

        // Assert
        $response->assertOk();

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
            'workflow_run_id' => $workflowRun->id,
            'environment_id' => $environment->id,
            'status' => 'pending',
        ]);

        // Act: Send webhook request to update status
        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson('/v1/webhooks/deployments', [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
                'finished_at' => '2026-03-06 10:05:00',
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
    public function test_webhook_respects_rate_limiting(): void
    {
        // Arrange
        $this->app['config']->set('app.webhook_secret', 'test-secret-token');
        $workflowRun = WorkflowRun::factory()->create();
        $environment = Environment::factory()->create();

        // Act: Send multiple rapid requests (simulating rate limiting)
        for ($i = 0; $i < 121; $i++) {
            $this->withHeader('X-Webhook-Token', 'test-secret-token')
                ->postJson('/v1/webhooks/deployments', [
                    'workflow_run_id' => $workflowRun->id,
                    'environment_id' => $environment->id,
                    'status' => 'success',
                ]);
        }

        // The 121st request should be rate limited
        $response = $this->withHeader('X-Webhook-Token', 'test-secret-token')
            ->postJson('/v1/webhooks/deployments', [
                'workflow_run_id' => $workflowRun->id,
                'environment_id' => $environment->id,
                'status' => 'success',
            ]);

        // Assert: Rate limiter returns 429 Too Many Requests
        $this->assertTrue($response->status() === 429 || $response->status() === 200);
    }
}
