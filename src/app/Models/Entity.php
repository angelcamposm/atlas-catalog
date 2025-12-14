<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\EntityObserver;
use App\Traits\BelongsToUser;
use Database\Factories\EntityFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property int $created_by
 * @property int $updated_by
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @property-read User|null $creator The user who created this language entry.
 * @property-read User|null $updater The user who last updated this language entry.
 *
 * @use HasFactory<EntityFactory>
 */
#[ObservedBy(EntityObserver::class)]
class Entity extends Model
{
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'entities';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'is_aggregate',
        'is_aggregate_root',
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
     * Get the properties that belong to this entity.
     *
     * @return HasMany<EntityAttribute>
     */
    public function properties(): HasMany
    {
        return $this->hasMany(EntityAttribute::class, 'entity_id');
    }
}
