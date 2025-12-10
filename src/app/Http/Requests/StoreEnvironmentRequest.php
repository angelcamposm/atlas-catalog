<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEnvironmentRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:50', 'unique:environments,name'],
            'abbr' => ['nullable', 'string', 'max:3'],
            'approval_required' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string', 'max:255'],
            'display_in_matrix' => ['sometimes', 'boolean'],
            'display_name' => ['nullable', 'string', 'max:50'],
            'is_production_environment' => ['sometimes', 'boolean'],
            'owner_id' => ['nullable', 'integer', 'exists:users,id'],
            'prefix' => ['nullable', 'string', 'max:3'],
            'sort_order' => ['sometimes', 'integer'],
            'suffix' => ['nullable', 'string', 'max:3'],
        ];
    }
}
