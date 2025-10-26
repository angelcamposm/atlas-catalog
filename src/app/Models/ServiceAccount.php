<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ServiceAccountObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ServiceAccountFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $namespace
 * @property int $created_by
 * @property int $updated_by
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 * @use HasFactory<ServiceAccountFactory>
 */
#[ObservedBy(ServiceAccountObserver::class)]
class ServiceAccount extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'service_accounts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'namespace',
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
     * Get the service account tokens associated with the service account.
     *
     * @return HasMany<ServiceAccountToken>
     */
    public function tokens(): HasMany
    {
        return $this->hasMany(ServiceAccount::class, 'service_account_id', 'id');
    }
}
