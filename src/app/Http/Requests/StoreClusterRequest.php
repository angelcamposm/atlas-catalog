<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\K8sLicensingModel;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreClusterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50', 'unique:clusters,name'],
            'api_url' => ['nullable', 'string', 'url', 'max:255'],
            'cluster_uuid' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'display_name' => ['nullable', 'string', 'max:50'],
            'full_version' => ['nullable', 'string', 'max:50'],
            'has_licensing' => ['sometimes', 'boolean'],
            'infrastructure_type_id' => ['nullable', 'integer', 'exists:infrastructure_types,id'],
            'licensing_model' => ['sometimes', new Enum(K8sLicensingModel::class)],
            'lifecycle_id' => ['nullable', 'integer', 'exists:lifecycle_phases,id'],
            'tags' => ['nullable', 'json'],
            'timezone' => ['nullable', 'string', 'max:255'],
            'type_id' => ['nullable', 'integer', 'exists:cluster_types,id'],
            'version' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'url', 'max:255'],
        ];
    }
}
