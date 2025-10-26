<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\CpuArchitecture;
use App\Enums\DiscoverySource;
use App\Enums\NodeType;
use App\Models\Node;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

/**
 * @property Node $node
 */
class UpdateNodeRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:253', Rule::unique('nodes')->ignore($this->node)],
            'discovery_source' => ['sometimes', new Enum(DiscoverySource::class)],
            'cpu_architecture' => ['sometimes', new Enum(CpuArchitecture::class)],
            'cpu_sockets' => ['sometimes', 'integer', 'min:1', 'max:255'],
            'cpu_cores' => ['sometimes', 'integer', 'min:1', 'max:255'],
            'cpu_threads' => ['sometimes', 'integer', 'min:1', 'max:255'],
            'smt_enabled' => ['sometimes', 'boolean'],
            'memory_bytes' => ['sometimes', 'integer', 'min:0'],
            'hostname' => ['sometimes', 'nullable', 'string', 'max:255'],
            'fqdn' => ['sometimes', 'nullable', 'string', 'max:255'],
            'ip_address' => ['sometimes', 'nullable', 'ip'],
            'mac_address' => ['sometimes', 'nullable', 'mac_address'],
            'node_type' => ['sometimes', new Enum(NodeType::class)],
            'os' => ['sometimes', 'string', 'max:255'],
            'os_version' => ['sometimes', 'string', 'max:255'],
            'timezone' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
