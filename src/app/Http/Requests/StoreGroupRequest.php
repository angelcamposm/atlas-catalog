<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:50', 'unique:groups,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'label' => ['nullable', 'string', 'max:50'],
            'parent_id' => ['nullable', 'integer', 'exists:groups,id'],
            'type_id' => ['nullable', 'integer', 'exists:group_types,id'],
        ];
    }
}
