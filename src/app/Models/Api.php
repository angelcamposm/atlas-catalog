<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Protocol;
use App\Observers\ApiObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ApiFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $display_name
 * @property string $description
 * @property string $url
 * @property string $version
 * @property string $protocol
 * @property array $document_specification
 * @property Carbon|null $released_at
 * @property Carbon|null $deprecated_at
 * @property string|null $deprecation_reason
 * @property int|null $access_policy_id
 * @property int|null $authentication_method_id
 * @property int|null $category_id
 * @property int|null $status_id
 * @property int|null $type_id
 * @property int|null $deprecated_by
 * @property int|null $created_by
 * @property int|null $updated_by
 *
 * @property-read ApiAccessPolicy|null $accessPolicy
 * @property-read AuthenticationMethod|null $authenticationMethod
 * @property-read ApiCategory|null $category
 * @property-read ApiStatus|null $status
 * @property-read ApiType|null $type
 * @property-read User|null $deprecator
 * @property-read User|null $creator
 * @property-read User|null $updater
 *
 * @method static ApiFactory factory($count = null, $state = [])
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 */
#[ObservedBy(ApiObserver::class)]
class Api extends Model
{
    use BelongsToUser;
    use HasFactory;

    protected $table = 'apis';

    protected $fillable = [
        'access_policy_id',
        'authentication_method_id',
        'category_id',
        'deprecated_at',
        'created_by',
        'deprecated_by',
        'deprecation_reason',
        'description',
        'display_name',
        'document_specification',
        'name',
        'protocol',
        'released_at',
        'status_id',
        'type_id',
        'updated_by',
        'url',
        'version',
    ];

    protected $casts = [
        'document_specification' => 'array',
        'protocol' => Protocol::class,
        'released_at' => 'datetime',
        'deprecated_at' => 'datetime',
    ];

    /**
     * Get the access policy associated with the API.
     *
     * @return BelongsTo<ApiAccessPolicy>
     */
    public function accessPolicy(): BelongsTo
    {
        return $this->belongsTo(ApiAccessPolicy::class, 'access_policy_id');
    }

    /**
     * Get the authentication method associated with the API.
     *
     * @return BelongsTo<AuthenticationMethod>
     */
    public function authenticationMethod(): BelongsTo
    {
        return $this->belongsTo(AuthenticationMethod::class, 'authentication_method_id');
    }

    /**
     * Get the category associated with the API.
     *
     * @return BelongsTo<ApiCategory>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ApiCategory::class, 'category_id', 'id');
    }

    /**
     * Get the status associated with the API.
     *
     * @return BelongsTo<ApiStatus>
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(ApiStatus::class, 'status_id');
    }

    /**
     * Get the type associated with the API.
     *
     * @return BelongsTo<ApiType>
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(ApiType::class, 'type_id');
    }

    /**
     * Get the user who deprecated the API.
     *
     * @return BelongsTo<User>
     */
    public function deprecator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deprecated_by');
    }

    /**
     * Check if the API is deprecated.
     *
     * @return bool
     */
    public function isDeprecated(): bool
    {
        return $this->deprecated_at !== null && $this->deprecated_at->isPast();
    }

    /**
     * Check if the API is released.
     *
     * @return bool
     */
    public function isReleased(): bool
    {
        return $this->released_at !== null && $this->released_at->isPast();
    }
}
