<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\DiscoverySource;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWorkflowJobRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'component_id' => ['sometimes', 'required', 'integer', 'exists:components,id'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discovery_source' => ['sometimes', 'required', 'string', Rule::in(DiscoverySource::values())],
            'is_enabled' => ['sometimes', 'required', 'boolean'],
            'url' => ['nullable', 'url'],
        ];
    }
}
