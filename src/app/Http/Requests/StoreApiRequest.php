<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

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
            'name' => ['required', 'string', 'max:50', 'unique:apis,name'],
            'description' => ['required', 'string', 'max:255'],
            'access_policy_id' => ['nullable', 'integer', 'exists:api_access_policies,id'],
            'authentication_method_id' => ['nullable', 'integer', 'exists:authentication_methods,id'],
            'protocol' => ['sometimes', 'string', 'max:25'],
            'document_specification' => ['required', 'json'],
            'status_id' => ['nullable', 'integer', 'exists:api_statuses,id'],
            'type_id' => ['nullable', 'integer', 'exists:api_types,id'],
            'url' => ['required', 'string', 'url', 'max:255'],
            'version' => ['required', 'string', 'max:50'],
        ];
    }
}
