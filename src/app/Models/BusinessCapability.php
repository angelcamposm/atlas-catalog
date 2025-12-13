<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\StrategicValue;
use App\Observers\BusinessCapabilityObserver;
use App\Traits\BelongsToUser;
use App\Traits\HasRelatives;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int $parent_id
 * @property int $strategic_value
 * @property int $created_by
 * @property int $updated_by
 * @property-read User|null $creator The user who created this language entry.
 * @property-read User|null $updater The user who last updated this language entry.
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static hasChildren()
 * @method static hasParent()
 * @method static inRandomOrder()
 * @method static isRoot()
 * @method static onlyChildren()
 * @method static onlyParents()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 */
#[ObservedBy(BusinessCapabilityObserver::class)]
class BusinessCapability extends Model
{
    use BelongsToUser;
    use HasFactory;
    use HasRelatives;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'business_capabilities';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'parent_id',
        'strategic_value',
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
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'strategic_value' => StrategicValue::class,
    ];
}
