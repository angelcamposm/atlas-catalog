<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\BusinessDomain;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property BusinessDomain $businessDomain
 */
class UpdateBusinessDomainRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('business_domains')->ignore($this->businessDomain)],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:1'],
            'is_enabled' => ['sometimes', 'boolean'],
            'parent_id' => ['sometimes', 'nullable', 'integer', 'exists:business_domains,id'],
        ];
    }
}
