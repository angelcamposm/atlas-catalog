<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\EntityType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreEntityAttributeRequest extends FormRequest
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
            'entity_id' => 'required|exists:entities,id',
            'name' => 'required|string|max:50',
            'description' => 'nullable|string|max:255',
            'type' => ['required', new Enum(EntityType::class)],
        ];
    }
}
