<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceModelRequest extends FormRequest
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
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('service_models')->ignore($this->route('service_model')),
            ],
            'slug' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('service_models')->ignore($this->route('service_model')),
            ],
            'abbrv' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('service_models')->ignore($this->route('service_model')),
            ],
            'display_name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
