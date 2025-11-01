<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\CpuArchitecture;
use App\Enums\DiscoverySource;
use App\Enums\NodeType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreNodeRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:253', 'unique:nodes,name'],
            'discovery_source' => ['sometimes', new Enum(DiscoverySource::class)],
            'cpu_architecture' => ['sometimes', new Enum(CpuArchitecture::class)],
            'cpu_sockets' => ['sometimes', 'integer', 'min:1', 'max:255'],
            'cpu_cores' => ['required', 'integer', 'min:1', 'max:255'],
            'cpu_threads' => ['required', 'integer', 'min:1', 'max:255'],
            'smt_enabled' => ['sometimes', 'boolean'],
            'memory_bytes' => ['sometimes', 'integer', 'min:0'],
            'hostname' => ['nullable', 'string', 'max:255'],
            'fqdn' => ['nullable', 'string', 'max:255'],
            'ip_address' => ['nullable', 'ip'],
            'mac_address' => ['nullable', 'mac_address'],
            'node_type' => ['sometimes', new Enum(NodeType::class)],
            'os' => ['required', 'string', 'max:255'],
            'os_version' => ['required', 'string', 'max:255'],
            'timezone' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
