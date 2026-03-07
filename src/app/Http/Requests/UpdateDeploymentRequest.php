<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\DeploymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Deployment;

class UpdateDeploymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('deployment')) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(DeploymentStatus::class)],
            'ended_at' => ['nullable', 'date'],
            'meta' => ['nullable', 'array'],
        ];
    }
}
