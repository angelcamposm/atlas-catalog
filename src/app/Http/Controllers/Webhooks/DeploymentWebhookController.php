<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Enums\DeploymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\DeploymentResource;
use App\Models\WorkflowRun;
use App\Services\DeploymentService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
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
    public function __construct(private readonly DeploymentService $deploymentService) {}

    /**
     * Create a new deployment record from webhook payload.
     *
     * @param Request $request
     * @return DeploymentResource|JsonResponse
     * @throws ValidationException
     */
    public function __invoke(Request $request): DeploymentResource|JsonResponse
    {
        $validated = $request->validate([
            'workflow_run_id' => 'required|integer|exists:workflow_runs,id',
            'environment_id' => 'required|integer|exists:environments,id',
            'cluster_id' => 'nullable|integer|exists:clusters,id',
            'release_id' => 'nullable|integer|exists:releases,id',
            'status'          => ['required', 'string', Rule::in([...DeploymentStatus::values(), 'running'])],
            'started_at' => 'nullable|date_format:Y-m-d H:i:s',
            'finished_at' => 'nullable|date_format:Y-m-d H:i:s',
            'metadata' => 'nullable|array',
            'logs' => 'nullable|string',
        ]);

        try {
            $workflowRun = WorkflowRun::query()
                ->with('workflowJob:id,component_id')
                ->findOrFail($validated['workflow_run_id']);

            if ($workflowRun->workflowJob?->component_id === null) {
                throw ValidationException::withMessages([
                    'workflow_run_id' => 'The selected workflow run is not linked to a component.',
                ]);
            }

            [$deployment, $wasRecentlyCreated] = $this->deploymentService->createOrUpdateFromWebhook(
                $validated,
                $workflowRun,
            );

            return (new DeploymentResource(
                $deployment->load(['workflowRun', 'environment', 'cluster', 'release'])
            ))->response()->setStatusCode(
                $wasRecentlyCreated ? Response::HTTP_CREATED : Response::HTTP_OK
            );
        } catch (ValidationException $e) {
            throw $e;
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
