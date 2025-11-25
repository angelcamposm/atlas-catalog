<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ClusterTypeObserver;
use App\Traits\BelongsToUser;
use App\Traits\HasIcon;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $icon
 * @property bool $is_enabled
 * @property string $name
 * @property int $vendor_id
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
#[ObservedBy(ClusterTypeObserver::class)]
class ClusterType extends Model
{
    use BelongsToUser;
    use HasFactory;
    use HasIcon;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'cluster_types';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'icon',
        'is_enabled',
        'vendor_id',
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
     * Check if the cluster type is enabled.
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return $this->is_enabled;
    }

    /**
     * Get the vendor for this cluster type.
     *
     * @return BelongsTo<Vendor>
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
    }
}
