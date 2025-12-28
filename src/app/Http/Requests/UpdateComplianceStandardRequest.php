<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ComplianceStandard;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property ComplianceStandard $complianceStandard
 */
class UpdateComplianceStandardRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:60', Rule::unique('compliance_standards')->ignore($this->complianceStandard)],
            'country_code' => ['sometimes', 'nullable', 'string', 'max:3'],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'display_name' => ['sometimes', 'nullable', 'string', 'max:60'],
            'focus_area' => ['sometimes', 'nullable', 'string', 'max:50'],
            'industry' => ['sometimes', 'nullable', 'string', 'max:50'],
            'url' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
