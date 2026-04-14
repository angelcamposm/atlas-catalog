<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Deployment;
use App\Models\WorkflowRun;
use Illuminate\Support\Carbon;

/**
 * Centralises all business logic for creating and updating Deployment records,
 * shared between the REST CRUD controller and the CI/CD webhook controller.
 *
 * Responsibilities:
 *   - Auto-populate `started_at` on creation when not supplied.
 *   - Auto-calculate `duration_milliseconds` and default `ended_at` on updates.
 *   - Merge `meta` arrays instead of overwriting.
 *   - Normalise the webhook's external field names (`finished_at` → `ended_at`,
 *     `metadata` → `meta`, status alias `running` → `in_progress`) to the
 *     internal DB schema before persisting.
 */
class DeploymentService
{
    /**
     * Create a deployment from a validated CRUD store payload.
     * Auto-sets `started_at` to now when not provided.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Deployment
    {
        if (! isset($data['started_at'])) {
            $data['started_at'] = Carbon::now();
        }

        return Deployment::create($data);
    }

    /**
     * Update a deployment from a validated CRUD update payload.
     * Auto-populates `ended_at` and calculates `duration_milliseconds`.
     * Merges `meta` with existing value when both are present.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Deployment $deployment, array $data): Deployment
    {
        $endedAt = isset($data['ended_at'])
            ? Carbon::parse($data['ended_at'])
            : Carbon::now();

        $data['ended_at'] = $endedAt;

        if ($deployment->started_at) {
            $data['duration_milliseconds'] = $deployment->started_at->diffInMilliseconds($endedAt);
        }

        if (isset($data['meta']) && $deployment->meta) {
            $data['meta'] = array_merge($deployment->meta, $data['meta']);
        }

        $deployment->update($data);

        return $deployment;
    }

    /**
     * Create or update a deployment from a normalised webhook payload.
     *
     * External → internal field mapping applied here:
     *   - `finished_at`  → `ended_at`
     *   - `metadata`     → `meta`   (merged, not replaced)
     *   - `logs`         → appended into `meta['logs']`
     *   - status `running` → `in_progress`
     *
     * Returns the persisted Deployment and a boolean indicating whether the
     * record was freshly created (true) or updated (false).
     *
     * @param  array<string, mixed>  $validated
     * @return array{0: Deployment, 1: bool}
     */
    public function createOrUpdateFromWebhook(array $validated, WorkflowRun $workflowRun): array
    {
        //TODO: A Implementar correctamente en base a contexto del workflowRun
        $deployment = Deployment::firstOrNew([
            'workflow_run_id' => $validated['workflow_run_id'],
            'environment_id'  => $validated['environment_id'],
        ]);

        $wasRecentlyCreated = ! $deployment->exists;

        $attributes = [
            'component_id' => $workflowRun->workflowJob->component_id,
            'status'       => $validated['status'] === 'running' ? 'in_progress' : $validated['status'],
        ];

        if (array_key_exists('cluster_id', $validated)) {
            $attributes['cluster_id'] = $validated['cluster_id'];
        }

        if (array_key_exists('release_id', $validated)) {
            $attributes['release_id'] = $validated['release_id'];
        }

        if (array_key_exists('started_at', $validated)) {
            $attributes['started_at'] = $validated['started_at'];
        }

        // External `finished_at` maps to internal `ended_at`
        if (array_key_exists('finished_at', $validated)) {
            $attributes['ended_at'] = $validated['finished_at'];
        }

        // External `metadata` and `logs` are merged into internal `meta`
        if (array_key_exists('metadata', $validated) || array_key_exists('logs', $validated)) {
            $meta = $deployment->meta ?? [];

            if (array_key_exists('metadata', $validated)) {
                $meta = array_merge($meta, $validated['metadata'] ?? []);
            }

            if (($validated['logs'] ?? null) !== null) {
                $meta['logs'] = $validated['logs'];
            }

            $attributes['meta'] = $meta;
        }

        $deployment->fill($attributes);
        $deployment->save();

        return [$deployment, $wasRecentlyCreated];
    }
}
