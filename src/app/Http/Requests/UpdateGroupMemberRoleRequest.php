<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\GroupMemberRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property GroupMemberRole $groupMemberRole
 */
class UpdateGroupMemberRoleRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('group_member_roles')->ignore($this->groupMemberRole)],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
