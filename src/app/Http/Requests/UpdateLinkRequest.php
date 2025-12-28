<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Link;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property Link $link
 */
class UpdateLinkRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('links')->ignore($this->link)],
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'description' => ['nullable', 'string', 'max:255'],
            'model_name' => ['nullable', 'string', 'max:255'],
            'model_id' => ['nullable', 'integer'],
            'url' => ['required', 'string', 'max:255'],
        ];
    }
}
