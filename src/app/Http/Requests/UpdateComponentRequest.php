<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Component;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property Component $component
 */
class UpdateComponentRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('components')->ignore($this->component)],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'discovery_source' => ['sometimes', 'nullable', 'string', 'max:255'],
            'display_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'domain_id' => ['sometimes', 'nullable', 'integer', 'exists:business_domains,id'],
            'has_zero_downtime_deployments' => ['sometimes', 'boolean'],
            'is_stateless' => ['sometimes', 'boolean'],
            'lifecycle_id' => ['sometimes', 'nullable', 'integer', 'exists:lifecycles,id'],
            'owner_id' => ['sometimes', 'nullable', 'integer', 'exists:teams,id'],
            'platform_id' => ['sometimes', 'nullable', 'integer', 'exists:platforms,id'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('components')->ignore($this->component)],
            'tags' => ['sometimes', 'nullable', 'json'],
            'tier_id' => ['sometimes', 'nullable', 'integer', 'exists:business_tiers,id'],
        ];
    }
}
