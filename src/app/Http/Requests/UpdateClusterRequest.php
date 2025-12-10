<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\K8sLicensingModel;
use App\Models\Cluster;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

/**
 * @property Cluster $cluster
 */
class UpdateClusterRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('clusters')->ignore($this->cluster)],
            'api_url' => ['sometimes', 'nullable', 'string', 'url', 'max:255'],
            'cluster_uuid' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'display_name' => ['sometimes', 'nullable', 'string', 'max:50'],
            'full_version' => ['sometimes', 'nullable', 'string', 'max:50'],
            'has_licensing' => ['sometimes', 'boolean'],
            'licensing_model' => ['sometimes', new Enum(K8sLicensingModel::class)],
            'lifecycle_id' => ['sometimes', 'nullable', 'integer', 'exists:lifecycles,id'],
            'tags' => ['sometimes', 'nullable', 'json'],
            'timezone' => ['sometimes', 'nullable', 'string', 'max:255'],
            'type_id' => ['sometimes', 'nullable', 'integer', 'exists:cluster_types,id'],
            'version' => ['sometimes', 'nullable', 'string', 'max:255'],
            'url' => ['sometimes', 'nullable', 'string', 'url', 'max:255'],
        ];
    }
}
