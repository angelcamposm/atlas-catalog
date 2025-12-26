<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReleaseRequest extends FormRequest
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
            'component_id' => ['required', 'integer', 'exists:components,id'],
            'workflow_run_id' => ['nullable', 'integer', 'exists:workflow_runs,id'],
            'version' => [
                'required',
                'string',
                'max:255',
                Rule::unique('releases')->where(function ($query) {
                    return $query->where('component_id', $this->component_id);
                }),
            ],
            'status' => ['required', 'string', 'max:20'],
            'changelog' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
            'released_at' => ['nullable', 'date'],
        ];
    }
}
