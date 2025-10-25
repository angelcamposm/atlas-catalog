<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Environment;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property Environment $environment
 */
class UpdateEnvironmentRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('environments')->ignore($this->environment)],
            'abbr' => ['sometimes', 'nullable', 'string', 'max:3'],
            'approval_required' => ['sometimes', 'boolean'],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'display_in_matrix' => ['sometimes', 'boolean'],
            'display_name' => ['sometimes', 'nullable', 'string', 'max:50'],
            'owner_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'prefix' => ['sometimes', 'nullable', 'string', 'max:3'],
            'sort_order' => ['sometimes', 'integer'],
            'suffix' => ['sometimes', 'nullable', 'string', 'max:3'],
        ];
    }
}
