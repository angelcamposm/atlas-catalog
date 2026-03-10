<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\StrategicValue;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\BusinessCapability;

class StoreBusinessCapabilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', BusinessCapability::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', 'unique:business_capabilities,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:business_capabilities,id'],
            'strategic_value' => ['nullable', 'integer', Rule::in(StrategicValue::values())],
            'organization_id' => ['nullable', 'integer', 'exists:organizations,id'],
        ];
    }
}
