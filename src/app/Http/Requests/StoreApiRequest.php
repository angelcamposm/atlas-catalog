<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Protocol;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreApiRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100', 'unique:apis,name'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'url', 'max:255'],
            'version' => ['required', 'string', 'max:50'],
            'protocol' => ['sometimes', new Enum(Protocol::class)],
            'document_specification' => ['required', 'json'],
            'released_at' => ['nullable', 'date'],
            'deprecated_at' => ['nullable', 'date'],
            'deprecation_reason' => ['nullable', 'string', 'max:255'],
            'access_policy_id' => ['nullable', 'integer', 'exists:api_access_policies,id'],
            'authentication_method_id' => ['nullable', 'integer', 'exists:authentication_methods,id'],
            'category_id' => ['nullable', 'integer', 'exists:api_categories,id'],
            'status_id' => ['nullable', 'integer', 'exists:api_statuses,id'],
            'type_id' => ['nullable', 'integer', 'exists:api_types,id'],
            'deprecated_by' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
