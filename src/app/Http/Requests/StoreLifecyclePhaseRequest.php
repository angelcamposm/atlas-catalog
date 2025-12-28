<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Rules\ColorRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreLifecyclePhaseRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:50', 'unique:lifecycle_phases,name'],
            'approval_required' => ['sometimes', 'boolean'],
            'color' => ['required', new ColorRule()],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
