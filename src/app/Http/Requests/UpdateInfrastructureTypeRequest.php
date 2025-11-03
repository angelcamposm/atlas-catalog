<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\InfrastructureType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property InfrastructureType $infrastructure_type
 */
class UpdateInfrastructureTypeRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('infrastructure_types')->ignore($this->infrastructure_type)],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
