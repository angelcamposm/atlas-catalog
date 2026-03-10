<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ComplianceRequirement;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreComplianceRequirementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', ComplianceRequirement::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', 'unique:compliance_requirements,name'],
            'description' => ['nullable', 'string'],
            'severity' => ['nullable', 'string', 'in:critical,high,medium,low'],
        ];
    }
}
