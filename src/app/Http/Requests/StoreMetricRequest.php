<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Metric;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMetricRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Metric::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'value' => ['required', 'numeric'],
            'unit' => ['nullable', 'string', 'max:50'],
            'metric_definition_id' => ['required', 'integer', 'exists:metric_definitions,id'],
            'component_id' => ['nullable', 'integer', 'exists:components,id'],
        ];
    }
}
