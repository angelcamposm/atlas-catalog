<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\DeploymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Deployment;

class StoreDeploymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Deployment::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'component_id' => ['required', 'integer', 'exists:components,id'],
            'environment_id' => ['required', 'integer', 'exists:environments,id'],
            'cluster_id' => ['nullable', 'integer', 'exists:clusters,id'],
            'release_id' => ['nullable', 'integer', 'exists:releases,id'],
            'version' => ['nullable', 'string', 'max:255'],
            'commit_hash' => ['nullable', 'string', 'max:40'],
            'docker_image_digest' => ['nullable', 'string', 'max:255'],
            'workflow_run_id' => ['nullable', 'integer', 'exists:workflow_runs,id'],
            'triggered_by' => ['nullable', 'integer', 'exists:users,id'],
            'status' => ['required', Rule::enum(DeploymentStatus::class)],
            'started_at' => ['nullable', 'date'],
            'meta' => ['nullable', 'array'],
        ];
    }
}
