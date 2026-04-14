<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\WorkflowRunResult;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\WorkflowRun;

class StoreWorkflowRunRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', WorkflowRun::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'workflow_job_id' => ['required', 'integer', 'exists:workflow_jobs,id'],
            'description' => ['required', 'string'],
            'display_name' => ['required', 'string', 'max:255'],
            'duration_milliseconds' => ['required', 'integer'],
            'is_enabled' => ['required', 'boolean'],
            'result' => ['required', 'string', Rule::in(WorkflowRunResult::values())],
            'url' => ['nullable', 'url'],
            'started_at' => ['required', 'date'],
            'started_by' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
