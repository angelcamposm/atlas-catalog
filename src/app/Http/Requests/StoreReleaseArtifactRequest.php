<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReleaseArtifactRequest extends FormRequest
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
            'release_id' => ['required', 'integer', 'exists:releases,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'digest_md5' => ['nullable', 'string', 'max:32'],
            'digest_sha1' => ['nullable', 'string', 'max:40'],
            'digest_sha256' => ['nullable', 'string', 'max:64'],
            'size_bytes' => ['nullable', 'integer'],
            'type' => ['required', 'string', 'max:50'],
            'url' => ['required', 'string', 'max:512'],
        ];
    }
}
