<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ApiStatusObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ApiStatusFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
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
 * @use HasFactory<ApiStatusFactory>
 */
#[ObservedBy(ApiStatusObserver::class)]
class ApiStatus extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'api_statuses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'created_by',
        'updated_by',
    ];

    /**
     * Get the APIs associated with this status.
     *
     * @return HasMany<Api>
     */
    public function apis(): HasMany
    {
        return $this->hasMany(Api::class, 'status_id', 'id');
    }
}
