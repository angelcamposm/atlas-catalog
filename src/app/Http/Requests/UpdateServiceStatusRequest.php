<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ServiceStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property ServiceStatus $service_status
 */
class UpdateServiceStatusRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('service_statuses')->ignore($this->service_status)],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
