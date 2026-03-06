<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Resources\DeploymentResource;
use App\Models\Deployment;
use App\Models\WorkflowRun;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Handle webhook POST requests from CI/CD systems (Jenkins, GitHub Actions, etc.).
 *
 * This controller receives JSON payloads containing deployment execution data
 * and creates/updates Deployment records in the database.
 */
class DeploymentWebhookController extends Controller
{
    /**
     * Create a new deployment record from webhook payload.
     *
     * @param Request $request
     * @return DeploymentResource|JsonResponse
     * @throws ValidationException
     */
    public function __invoke(Request $request): DeploymentResource|JsonResponse
    {
        // Validate webhook payload structure
        $validated = $request->validate([
            'workflow_run_id' => 'required|integer|exists:workflow_runs,id',
            'environment_id' => 'required|integer|exists:environments,id',
            'cluster_id' => 'nullable|integer|exists:clusters,id',
            'release_id' => 'nullable|integer|exists:releases,id',
            'status' => 'required|string|in:pending,running,success,failed,cancelled',
            'started_at' => 'nullable|date_format:Y-m-d H:i:s',
            'finished_at' => 'nullable|date_format:Y-m-d H:i:s',
            'metadata' => 'nullable|array',
            'logs' => 'nullable|string',
        ]);

        try {
            // Find or create deployment
            $deployment = Deployment::updateOrCreate(
                [
                    'workflow_run_id' => $validated['workflow_run_id'],
                    'environment_id' => $validated['environment_id'],
                ],
                [
                    'cluster_id' => $validated['cluster_id'],
                    'release_id' => $validated['release_id'],
                    'status' => $validated['status'],
                    'started_at' => $validated['started_at'],
                    'finished_at' => $validated['finished_at'],
                    'metadata' => $validated['metadata'] ?? [],
                    'logs' => $validated['logs'],
                ]
            );

            return new DeploymentResource(
                $deployment->load(['workflowRun', 'environment', 'cluster', 'release'])
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to process webhook',
                    'message' => $e->getMessage(),
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
