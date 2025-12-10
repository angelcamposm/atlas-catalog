<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\SystemObserver;
use App\Traits\BelongsToUser;
use Database\Factories\SystemFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property string $display_name
 * @property string $description
 * @property int $owner_id
 * @property string $tags
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
 * @property-read Collection<int, Component> $components
 *
 * @use HasFactory<SystemFactory>
 */
#[ObservedBy(SystemObserver::class)]
class System extends Model
{
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'systems';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'owner_id',
        'tags',
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
     * The components that belong to the system.
     *
     * @return BelongsToMany<Component>
     */
    public function components(): BelongsToMany
    {
        return $this->belongsToMany(Component::class, 'system_components');
    }

    /**
     * Check if the system has components.
     *
     * @return bool
     */
    public function hasComponents(): bool
    {
        return $this->components()->exists();
    }
}
