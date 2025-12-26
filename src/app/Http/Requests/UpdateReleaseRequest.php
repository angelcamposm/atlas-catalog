<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReleaseRequest extends FormRequest
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
            'component_id' => ['sometimes', 'integer', 'exists:components,id'],
            'workflow_run_id' => ['nullable', 'integer', 'exists:workflow_runs,id'],
            'version' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('releases')->where(function ($query) {
                    return $query->where('component_id', $this->component_id ?? $this->release->component_id);
                })->ignore($this->release),
            ],
            'status' => ['sometimes', 'string', 'max:20'],
            'changelog' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
            'released_at' => ['nullable', 'date'],
        ];
    }
}
