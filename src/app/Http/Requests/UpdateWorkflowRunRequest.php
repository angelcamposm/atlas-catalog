<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\WorkflowRunResult;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWorkflowRunRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'workflow_job_id' => ['sometimes', 'required', 'integer', 'exists:workflow_jobs,id'],
            'description' => ['nullable', 'string'],
            'display_name' => ['sometimes', 'required', 'string', 'max:255'],
            'duration_milliseconds' => ['sometimes', 'required', 'integer'],
            'is_enabled' => ['sometimes', 'required', 'boolean'],
            'result' => ['sometimes', 'required', 'string', Rule::in(WorkflowRunResult::values())],
            'url' => ['nullable', 'url'],
            'started_at' => ['sometimes', 'required', 'date'],
            'started_by' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
