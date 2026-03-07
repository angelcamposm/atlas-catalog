<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMetricRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('metric')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'value' => ['sometimes', 'numeric'],
            'unit' => ['nullable', 'string', 'max:50'],
            'metric_definition_id' => ['sometimes', 'integer', 'exists:metric_definitions,id'],
            'component_id' => ['nullable', 'integer', 'exists:components,id'],
        ];
    }
}
