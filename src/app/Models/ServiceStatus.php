<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ServiceStatusObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ServiceStatusFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int $created_by
 * @property int $updated_by
 * @property-read User|null $creator The user who created this language entry.
 * @property-read User|null $updater The user who last updated this language entry.
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @use HasFactory<ServiceStatusFactory>
 */
#[ObservedBy(ServiceStatusObserver::class)]
class ServiceStatus extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'service_statuses';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'allow_deployments',
        'description',
        'icon',
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
     * Get the components that have this status
     *
     * @return HasMany<Component>
     */
    public function components(): HasMany
    {
        return $this->hasMany(Component::class, 'status_id', 'id');
    }
}
