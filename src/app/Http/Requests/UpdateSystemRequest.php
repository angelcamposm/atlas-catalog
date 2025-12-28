<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('systems')->ignore($this->system)],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'display_name' => ['sometimes', 'nullable', 'string', 'max:50'],
            'owner_id' => ['sometimes', 'nullable', 'integer', 'exists:groups,id'],
            'tags' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
