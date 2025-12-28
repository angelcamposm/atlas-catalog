<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:50', 'unique:categories,name'],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'icon' => ['sometimes', 'string', 'max:50'],
            'model' => ['nullable', 'string', 'max:25'],
            'parent_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
        ];
    }
}
