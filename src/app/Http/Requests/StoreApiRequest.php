<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Protocol;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Models\Api;

class StoreApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Api::class) ?? false;
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
            'description' => ['sometimes', 'string', 'max:255'],
            'url' => ['sometimes', 'string', 'url', 'max:255'],
            'version' => ['sometimes', 'string', 'max:50'],
            'protocol' => ['sometimes', new Enum(Protocol::class)],
            'document_specification' => ['sometimes', 'json'],
            'released_at' => ['nullable', 'date'],
            'deprecated_at' => ['nullable', 'date'],
            'deprecation_reason' => ['nullable', 'string', 'max:255'],
            'access_policy' => ['nullable', 'integer'],
            'authentication_method_id' => ['nullable', 'integer', 'exists:authentication_methods,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'api_status_id' => ['nullable', 'integer', 'exists:api_statuses,id'],
            'api_type_id' => ['nullable', 'integer', 'exists:api_types,id'],
            'deprecated_by' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
