<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\GroupTypeObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $description
 * @property string $name
 * @property int $created_by
 * @property int $updated_by
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 */
#[ObservedBy(GroupTypeObserver::class)]
class GroupType extends Model
{
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'group_types';

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
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        //
    ];

    /**
     * Get the groups associated with the group type.
     *
     * @return HasMany<Group>
     */
    public function groups(): HasMany
    {
        return $this->hasMany(Group::class, 'group_type_id');
    }
}
