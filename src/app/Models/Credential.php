<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\CredentialType;
use App\Observers\CredentialObserver;
use App\Traits\BelongsToUser;
use Database\Factories\CredentialFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property CredentialType $type
 * @property string|null $identity
 * @property array $secret
 * @property array|null $meta
 * @property Carbon|null $expires_at
 * @property Carbon|null $rotated_at
 * @property string|null $description
 * @property bool $is_enabled
 * @property int $created_by
 * @property int $updated_by
 *
 * @property-read User|null $creator The user who created this credential.
 * @property-read User|null $updater The user who last updated this credential.
 *
 * @use HasFactory<CredentialFactory>
 * @method static create(mixed $validated)
 */
#[ObservedBy(CredentialObserver::class)]
class Credential extends Model
{
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'credentials';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type',
        'identity',
        'secret',
        'meta',
        'expires_at',
        'rotated_at',
        'description',
        'is_enabled',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $hidden = [
        'secret',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => CredentialType::class,
            'secret' => 'encrypted:array',
            'meta' => 'array',
            'expires_at' => 'datetime',
            'rotated_at' => 'datetime',
            'is_enabled' => 'boolean',
        ];
    }

    public function jenkinsInstances(): HasMany
    {
        return $this->hasMany(JenkinsInstance::class);
    }

    /**
     * Get the primary secret value based on the credential type.
     *
     * @return string|null
     */
    public function getSecretValue(): ?string
    {
        return match ($this->type) {
            CredentialType::ApiToken => $this->secret['token'] ?? null,
            CredentialType::BasicAuth => $this->secret['password'] ?? null,
            CredentialType::BearerToken => $this->secret['bearer_token'] ?? null,
            CredentialType::SshKey => $this->secret['private_key'] ?? null,
            default => null,
        };
    }
}
