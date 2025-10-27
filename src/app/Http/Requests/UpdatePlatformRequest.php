<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Platform;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property Platform $platform
 */
class UpdatePlatformRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('platforms')->ignore($this->platform)],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['required', 'string', 'max:50'],
        ];
    }
}
