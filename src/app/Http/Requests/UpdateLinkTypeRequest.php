<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\LinkType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property LinkType $link_type
 */
class UpdateLinkTypeRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('link_types')->ignore($this->link_type)],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['required', 'string', 'max:50'],
        ];
    }
}
