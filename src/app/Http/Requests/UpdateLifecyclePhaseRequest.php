<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\LifecyclePhase;
use App\Rules\ColorRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property LifecyclePhase $lifecycle
 */
class UpdateLifecyclePhaseRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('lifecycle_phases')->ignore($this->lifecycle)],
            'approval_required' => ['sometimes', 'boolean'],
            'color' => ['sometimes', new ColorRule()],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
