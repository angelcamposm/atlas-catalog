<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\BusinessCapabilitySystem;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessCapabilitySystemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('business_capability_system')) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'business_capability_id' => ['sometimes', 'integer', 'exists:business_capabilities,id'],
            'system_id' => ['sometimes', 'integer', 'exists:systems,id'],
        ];
    }
}
