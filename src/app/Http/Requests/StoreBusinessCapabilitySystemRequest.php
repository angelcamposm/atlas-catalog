<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\BusinessCapabilitySystem;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBusinessCapabilitySystemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', BusinessCapabilitySystem::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'business_capability_id' => ['required', 'integer', 'exists:business_capabilities,id'],
            'system_id' => ['required', 'integer', 'exists:systems,id'],
        ];
    }
}
