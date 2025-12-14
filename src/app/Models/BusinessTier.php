<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\BusinessTierObserver;
use App\Traits\BelongsToUser;
use Database\Factories\BusinessTierFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $code
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
 *
 * @use HasFactory<BusinessTierFactory>
 */
#[ObservedBy(BusinessTierObserver::class)]
class BusinessTier extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'business_tiers';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'description',
        'name',
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
     * Get the components that belong to this business tier.
     *
     * @return HasMany<Component>
     */
    public function components(): HasMany
    {
        return $this->hasMany(Component::class, 'tier_id', 'id');
    }
}
