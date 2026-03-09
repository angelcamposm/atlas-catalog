<?php

declare(strict_types=1);

namespace App\Models;

use App\Exceptions\MissingCredentialException;
use App\Observers\CiServerObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $driver
 * @property string $url
 * @property int|null $credential_id
 * @property int|null $owner_id
 * @property array|null $meta
 * @property bool $is_enabled
 * @property Carbon|null $last_synced_at
 * @property int $created_by
 * @property int $updated_by
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @property-read User|null $creator The user who created this language entry.
 * @property-read User|null $updater The user who last updated this language entry.
 * @property-read Credential|null $credential
 * @property-read Group|null $owner
 */
#[ObservedBy(CiServerObserver::class)]
class CiServer extends Model
{
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'ci_servers';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'driver',
        'url',
        'credential_id',
        'owner_id',
        'meta',
        'is_enabled',
        'last_synced_at',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'meta' => 'array',
        'is_enabled' => 'boolean',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Get the credential associated with the CI server.
     */
    public function credential(): BelongsTo
    {
        return $this->belongsTo(Credential::class);
    }

    /**
     * Get the owner (Group) of the CI server.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'owner_id');
    }

    /**
     * Get the workflow jobs associated with the CI server.
     */
    public function workflowJobs(): HasMany
    {
        return $this->hasMany(WorkflowJob::class);
    }

    /**
     * Get the credential or throw an exception if missing.
     *
     * @return Credential
     * @throws MissingCredentialException
     */
    public function getCredentialOrThrow(): Credential
    {
        if (!$this->credential) {
            throw new MissingCredentialException(
                message: "No credentials configured for instance: {$this->name}"
            );
        }

        return $this->credential;
    }
}
