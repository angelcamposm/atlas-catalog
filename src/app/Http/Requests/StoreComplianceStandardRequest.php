<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreComplianceStandardRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:60', 'unique:compliance_standards,name'],
            'country_code' => ['nullable', 'string', 'max:3'],
            'description' => ['nullable', 'string', 'max:255'],
            'display_name' => ['nullable', 'string', 'max:60'],
            'focus_area' => ['nullable', 'string', 'max:50'],
            'industry' => ['nullable', 'string', 'max:50'],
            'url' => ['nullable', 'string', 'max:255'],
        ];
    }
}
