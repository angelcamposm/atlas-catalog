<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\AuthenticationMethod;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property AuthenticationMethod $authenticationMethod
 */
class UpdateAuthenticationMethodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('authentication_method')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('authentication_methods')->ignore($this->authenticationMethod)],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
