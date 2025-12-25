<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\BusinessDomainCategory;
use App\Http\Resources\BusinessDomainResource;
use App\Http\Resources\BusinessDomainResourceCollection;
use App\Observers\BusinessDomainObserver;
use App\Traits\BelongsToUser;
use App\Traits\HasRelatives;
use Database\Factories\BusinessDomainFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Database\Eloquent\Attributes\UseResourceCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property BusinessDomainCategory $category
 * @property string|null $description
 * @property string $display_name
 * @property bool $is_enabled
 * @property string $name
 * @property int $parent_id
 * @property int $created_by
 * @property int $updated_by
 * @property BusinessDomain $parent
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @use HasFactory<BusinessDomainFactory>
 */
#[ObservedBy(BusinessDomainObserver::class)]
#[UseFactory(BusinessDomainFactory::class)]
#[UseResource(BusinessDomainResource::class)]
#[UseResourceCollection(BusinessDomainResourceCollection::class)]
class BusinessDomain extends Model
{
    use BelongsToUser;
    use HasFactory;
    use HasRelatives;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'business_domains';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'display_name',
        'category',
        'is_enabled',
        'parent_id',
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
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category' => BusinessDomainCategory::class,
        ];
    }

    /**
     * Get the components that belong to this business domain.
     *
     * @return HasMany<Component>
     */
    public function components(): HasMany
    {
        return $this->hasMany(Component::class, 'domain_id', 'id');
    }

    /**
     * Get the entities associated with this business domain.
     *
     * @return BelongsToMany<Entity>
     */
    public function entities(): BelongsToMany
    {
        return $this->belongsToMany(Entity::class, 'business_domain_entities', 'business_domain_id');
    }

    /**
     * Check if the business domain is enabled.
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return $this->is_enabled;
    }
}
