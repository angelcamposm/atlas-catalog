<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Framework;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property Framework $framework
 */
class UpdateFrameworkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('framework')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('frameworks')->ignore($this->framework)],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['sometimes', 'string', 'max:50'],
            'is_enabled' => ['sometimes', 'boolean'],
            'language_id' => ['sometimes', 'integer', 'exists:programming_languages'],
            'url' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
