<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\DiscoverySource;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\WorkflowJob;

class StoreWorkflowJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', WorkflowJob::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'component_id' => ['required', 'integer', 'exists:components,id'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discovery_source' => ['required', 'string', Rule::in(DiscoverySource::values())],
            'is_enabled' => ['required', 'boolean'],
            'url' => ['nullable', 'url'],
        ];
    }
}
