<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\StrategicValue;
use App\Models\BusinessCapability;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property BusinessCapability $business_capability
 */
class UpdateBusinessCapabilityRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('business_capabilities')->ignore($this->business_capability)],
            'description' => ['nullable', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:business_capabilities,id'],
            'strategic_value' => ['required', 'integer', Rule::in(StrategicValue::values())],
        ];
    }
}
