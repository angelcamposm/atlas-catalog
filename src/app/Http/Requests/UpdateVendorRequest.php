<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Vendor;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property Vendor $vendor
 */
class UpdateVendorRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:50', Rule::unique('vendors', 'name')->ignore($this->vendor)],
            'icon' => ['required', 'string', 'max:50'],
            'url' => ['required', 'string', 'max:255'],
        ];
    }
}
