<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property mixed $businessTier
 */
class UpdateBusinessTierRequest extends FormRequest
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
     */    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:10', Rule::unique('business_tiers')->ignore($this->businessTier)],
            'name' => ['required', 'string', 'max:50', Rule::unique('business_tiers')->ignore($this->businessTier)],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
