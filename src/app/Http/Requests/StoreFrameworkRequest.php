<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Framework;

class StoreFrameworkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Framework::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50', 'unique:frameworks,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['required', 'string', 'max:50'],
            'is_enabled' => ['sometimes', 'boolean'],
            'language_id' => ['required', 'integer', 'exists:programming_languages'],
            'url' => ['required', 'string', 'max:255'],
        ];
    }
}
