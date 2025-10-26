<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ApiObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ApiFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property int $created_by
 * @property int $updated_by
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
    /**
     * @use HasFactory<ApiFactory>
     */
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'apis';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'released_at' => 'datetime',
        'deprecated_at' => 'datetime',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'access_policy_id',
        'authentication_method_id',
        'protocol',
        'document_specification',
        'status_id',
        'type_id',
        'url',
        'version',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        //
    ];

    /**
     * Get the access policy for the API.
     *
     * @return BelongsTo
     */
    public function accessPolicy(): BelongsTo
    {
        return $this->belongsTo(ApiAccessPolicy::class, 'access_policy_id');
    }

    /**
     * Get the status of the API.
     *
     * @return BelongsTo
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(ApiStatus::class, 'status_id');
    }

    /**
     * Get the type of the API.
     *
     * @return BelongsTo
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(ApiType::class, 'type_id');
    }

    /**
     * Check if the API is considered deprecated.
     *
     * @return bool
     */
    public function isDeprecated(): bool
    {
        return $this->deprecated_at !== null && $this->deprecated_at->isPast();
    }

    /**
     * Check if the API is considered published.
     *
     * @return bool
     */
    public function isPublished(): bool
    {
        return $this->published_at !== null && $this->published_at->isPast();
    }
}
