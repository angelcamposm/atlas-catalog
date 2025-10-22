<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBusinessDomainRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:50', 'unique:business_domains,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:1'],
            'is_active' => ['sometimes', 'boolean'],
            'parent_id' => ['nullable', 'integer', 'exists:business_domains,id'],
        ];
    }
}
