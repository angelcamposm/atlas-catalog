<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ProgrammingLanguage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property ProgrammingLanguage $programmingLanguage
 */
class UpdateProgrammingLanguageRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:50', Rule::unique('programming_languages', 'name')->ignore($this->programmingLanguage)],
            'icon' => ['required', 'string', 'max:50'],
            'is_enabled' => ['sometimes', 'boolean'],
            'url' => ['required', 'string', 'max:255'],
        ];
    }
}
