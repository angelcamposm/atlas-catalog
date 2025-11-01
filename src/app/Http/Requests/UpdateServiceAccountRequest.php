<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ServiceAccount;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property ServiceAccount $serviceAccount
 */
class UpdateServiceAccountRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:253', Rule::unique('service_accounts', 'name')->ignore($this->serviceAccount)],
            'namespace' => ['nullable', 'string', 'max:253'],
        ];
    }
}
