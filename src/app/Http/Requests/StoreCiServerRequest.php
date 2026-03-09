<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCiServerRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100', 'unique:ci_servers,name'],
            'driver' => ['required', 'string', 'max:50'],
            'url' => ['required', 'string', 'max:255', 'url'],
            'credential_id' => ['nullable', 'integer', 'exists:credentials,id'],
            'owner_id' => ['nullable', 'integer', 'exists:groups,id'],
            'meta' => ['nullable', 'array'],
            'is_enabled' => ['sometimes', 'boolean'],
        ];
    }
}
