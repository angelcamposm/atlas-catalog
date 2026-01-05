<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\DeploymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDeploymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', new Rule(DeploymentStatus::class)],
            'ended_at' => ['nullable', 'date'],
            'meta' => ['nullable', 'array'],
        ];
    }
}
