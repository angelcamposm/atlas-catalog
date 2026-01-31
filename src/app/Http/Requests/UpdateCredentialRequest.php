<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\CredentialType;
use App\Models\Credential;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property Credential $credential
 */
class UpdateCredentialRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:100', Rule::unique('credentials')->ignore($this->credential)],
            'type' => ['sometimes', Rule::enum(CredentialType::class)],
            'identity' => ['nullable', 'string', 'max:255'],
            'secret' => ['sometimes', 'array'],
            'meta' => ['nullable', 'array'],
            'expires_at' => ['nullable', 'date'],
            'rotated_at' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_enabled' => ['sometimes', 'boolean'],
        ];
    }
}
