<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Api;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property Api $api
 */
class UpdateApiRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('apis')->ignore($this->api)],
            'description' => ['sometimes', 'string', 'max:255'],
            'access_policy_id' => ['sometimes', 'nullable', 'integer', 'exists:api_access_policies,id'],
            'authentication_method_id' => ['sometimes', 'nullable', 'integer', 'exists:authentication_methods,id'],
            'protocol' => ['sometimes', 'string', 'max:25'],
            'document_specification' => ['sometimes', 'json'],
            'status_id' => ['sometimes', 'nullable', 'integer', 'exists:api_statuses,id'],
            'type_id' => ['sometimes', 'nullable', 'integer', 'exists:api_types,id'],
            'url' => ['sometimes', 'string', 'url', 'max:255'],
            'version' => ['sometimes', 'string', 'max:50'],
        ];
    }
}
