<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ClusterType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property ClusterType $clusterType
 */
class UpdateClusterTypeRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('cluster_types')->ignore($this->clusterType)],
            'icon' => ['required', 'string', 'max:50'],
            'is_enabled' => ['sometimes', 'boolean'],
        ];
    }
}
