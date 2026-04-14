<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ComplianceRequirement;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateComplianceRequirementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('compliance_requirement')) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('compliance_requirement')?->id;

        return [
            'name' => ['sometimes', 'string', 'max:100', 'unique:compliance_requirements,name,' . $id],
            'description' => ['nullable', 'string'],
            'severity' => ['nullable', 'string', 'in:critical,high,medium,low'],
        ];
    }
}
