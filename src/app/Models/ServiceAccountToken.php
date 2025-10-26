<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ServiceAccountTokenObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ServiceAccountTokenFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $service_account_id
 * @property string $token
 * @property string $expires_at
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
 * @use HasFactory<ServiceAccountTokenFactory>
 */
#[ObservedBy(ServiceAccountTokenObserver::class)]
class ServiceAccountToken extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'service_account_tokens';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'service_account_id',
        'token',
        'expires_at',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'token',
    ];

    /**
     * Scope a query to only include expired tokens.
     *
     * @param  Builder  $query
     *
     * @return void
     */
    #[Scope]
    protected function expired(Builder $query): void
    {
        $query->where('expires_at', '>=', Carbon::now());
    }

    /**
     * Scope a query to only include not expired tokens.
     *
     * @param  Builder  $query
     *
     * @return void
     */
    #[Scope]
    protected function notExpired(Builder $query): void
    {
        $query->where('expires_at', '<', Carbon::now());
    }

    /**
     * Determines if the current instance is expired based on the `expires_at` property.
     *
     * @return bool Returns true if the instance is expired, otherwise false.
     */
    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    /**
     * Get the service account associated with the token.
     *
     * @return BelongsTo<ServiceAccount>
     */
    public function serviceAccount(): BelongsTo
    {
        return $this->belongsTo(ServiceAccount::class, 'service_account_id');
    }
}
