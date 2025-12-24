<?php

declare(strict_types=1);

namespace App\Models;

use App\Http\Resources\LifecyclePhaseResource;
use App\Http\Resources\LifecyclePhaseResourceCollection;
use App\Observers\LifecyclePhaseObserver;
use App\Traits\BelongsToUser;
use Database\Factories\LifecyclePhaseFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Database\Eloquent\Attributes\UseResourceCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property bool $approval_required
 * @property string $color
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
#[ObservedBy(LifecyclePhaseObserver::class)]
#[UseFactory(LifecyclePhaseFactory::class)]
#[UseResource(LifecyclePhaseResource::class)]
#[UseResourceCollection(LifecyclePhaseResourceCollection::class)]
class LifecyclePhase extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'lifecycle_phases';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'approval_required',
        'color',
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
     * Get the components that belong to this lifecycle.
     *
     * @return BelongsToMany
     */
    public function components(): BelongsToMany
    {
        return $this->belongsToMany(Component::class, 'component_lifecycle_phases')
            ->as('phase_details')
            ->withPivot([
                'transitioned_at',
                'notes',
            ]);
    }

    /**
     * Check if the lifecycle requires approval.
     *
     * @return bool
     */
    public function needsApproval(): bool
    {
        return $this->approval_required;
    }
}
