<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreComponentRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'unique:components,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'discovery_source' => ['nullable', 'string', 'max:255'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'domain_id' => ['nullable', 'integer', 'exists:business_domains,id'],
            'has_zero_downtime_deployments' => ['sometimes', 'boolean'],
            'is_exposed' => ['sometimes', 'boolean'],
            'is_stateless' => ['sometimes', 'boolean'],
            'lifecycle_id' => ['nullable', 'integer', 'exists:lifecycle_phases,id'],
            'end_of_life_at' => ['nullable', 'date'],
            'owner_id' => ['nullable', 'integer', 'exists:groups,id'],
            'platform_id' => ['nullable', 'integer', 'exists:platforms,id'],
            'slug' => ['required', 'string', 'max:255', 'unique:components,slug'],
            'status_id' => ['nullable', 'integer', 'exists:service_statuses,id'],
            'tags' => ['nullable', 'json'],
            'tier_id' => ['nullable', 'integer', 'exists:business_tiers,id'],
        ];
    }
}
