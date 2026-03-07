<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\StrategicValue;
use App\Http\Resources\BusinessCapabilityResource;
use App\Http\Resources\BusinessCapabilityResourceCollection;
use App\Observers\BusinessCapabilityObserver;
use App\Traits\BelongsToUser;
use App\Traits\Filterable;
use App\Traits\HasRelatives;
use App\Traits\Searchable;
use App\Traits\Sortable;
use Database\Factories\BusinessCapabilityFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Database\Eloquent\Attributes\UseResourceCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
 *
 * @use HasFactory<BusinessCapabilityFactory>
 */
#[ObservedBy(BusinessCapabilityObserver::class)]
#[UseFactory(BusinessCapabilityFactory::class)]
#[UseResource(BusinessCapabilityResource::class)]
#[UseResourceCollection(BusinessCapabilityResourceCollection::class)]
class BusinessCapability extends Model
{
    use BelongsToUser;
    use Filterable;
    use HasFactory;
    use HasRelatives;
    use Searchable;
    use Sortable;

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
     * Fields that can be filtered.
     *
     * @var array<string>
     */
    protected array $filterable = [
        'parent_id',
        'strategic_value',
    ];

    /**
     * Fields that can be searched.
     *
     * @var array<string>
     */
    protected array $searchable = [
        'name',
        'description',
    ];

    /**
     * Fields that can be sorted.
     *
     * @var array<string>
     */
    protected array $sortable = [
        'id',
        'name',
        'created_at',
        'updated_at',
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
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'strategic_value' => StrategicValue::class,
        ];
    }

    /**
     * Get the system that provides this business capability.
     *
     * @return BelongsToMany
     */
    public function systems(): BelongsToMany
    {
        return $this->belongsToMany(System::class, 'system_business_capabilities', 'business_capability_id', 'system_id');
    }
}
