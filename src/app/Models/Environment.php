<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\EnvironmentObserver;
use App\Traits\BelongsToUser;
use Database\Factories\EnvironmentFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $abbr
 * @property bool $approval_required
 * @property string $description
 * @property bool $display_in_matrix
 * @property string $display_name
 * @property bool $is_production_environment
 * @property string $name
 * @property int $owner_id
 * @property string $prefix
 * @property int $sort_order
 * @property string $suffix
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
 * @use HasFactory<EnvironmentFactory>
 */
#[ObservedBy(EnvironmentObserver::class)]
class Environment extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'environments';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'abbr',
        'approval_required',
        'description',
        'display_in_matrix',
        'display_name',
        'is_production_environment',
        'owner_id',
        'prefix',
        'sort_order',
        'suffix',
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
     * Check if the environment has an owner.
     *
     * @return bool
     */
    public function hasOwner(): bool
    {
        return $this->owner_id !== null;
    }

    /**
     * Check if the environment requires approval.
     *
     * @return bool
     */
    public function needsApproval(): bool
    {
        return $this->approval_required;
    }
}
