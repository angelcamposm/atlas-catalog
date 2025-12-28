<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ComponentObserver;
use App\Traits\BelongsToUser;
use App\Traits\HasDeployments;
use Database\Factories\ComponentFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string $discovery_source
 * @property string $display_name
 * @property int $domain_id
 * @property bool $is_exposed
 * @property bool $is_stateless
 * @property int $lifecycle_id
 * @property int $platform_id
 * @property int $tier_id
 * @property string $slug
 * @property string $tags
 * @property int $created_by
 * @property int $updated_by
 * @property-read User|null $creator The user who created this language entry.
 * @property-read User|null $updater The user who last updated this language entry.
 * @property-read BusinessDomain|null $businessDomain The business domain of the component.
 * @property-read Group|null $owner The owner of the component.
 * @property-read LifecyclePhase|null $lifecycle The lifecycle of the component.
 * @property-read Platform|null $platform The platform of the component.
 * @property-read Collection<int, System> $systems
 *
 * @method static create(array $validated)
 * @method static factory($count = null, $state = [])
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 * @use HasFactory<ComponentFactory>
 */
#[ObservedBy(ComponentObserver::class)]
class Component extends Model
{
    use HasFactory;
    use BelongsToUser;
    use HasDeployments;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'components';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'discovery_source',
        'display_name',
        'domain_id',
        'has_zero_downtime_deployments',
        'lifecycle_id',
        'end_of_life_at',
        'is_exposed',
        'is_stateless',
        'owner_id',
        'platform_id',
        'slug',
        'status_id',
        'tags',
        'tier_id',
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

    public function apis(): BelongsToMany
    {
        return $this->belongsToMany(Api::class, 'component_apis');
    }

    /**
     * Get the business domain of the component
     *
     * @return BelongsTo<BusinessDomain>
     */
    public function domain(): BelongsTo
    {
        return $this->belongsTo(BusinessDomain::class, 'domain_id', 'id');
    }

    /**
     * Get the entities associated with the component
     *
     * @return BelongsToMany<Entity>
     */
    public function entities(): BelongsToMany
    {
        return $this->belongsToMany(Entity::class, 'component_entities');
    }

    /**
     * Get the group that owns this component
     *
     * @return BelongsTo<Group>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'owner_id', 'id');
    }

    /**
     * Get the lifecycle phases of the component.
     *
     * This relationship is constrained to select only the 'id' and 'name' fields
     * from the lifecycle_phases table for performance and clarity.
     *
     * @return BelongsToMany
     */
    public function lifecyclePhases(): BelongsToMany
    {
        return $this->belongsToMany(LifecyclePhase::class, 'component_lifecycle_phases')
            ->as('phase_details')
            ->select([
                'lifecycle_phases.id',
                'lifecycle_phases.name',
                'lifecycle_phases.approval_required',
                'lifecycle_phases.color',
            ])
            ->withPivot([
                'transitioned_at',
                'notes',
            ]);
    }

    /**
     * Get the platform of the component
     *
     * @return BelongsTo<Platform>
     */
    public function platform(): BelongsTo
    {
        return $this->belongsTo(Platform::class, 'platform_id', 'id');
    }

    /**
     * Get the status of the component
     *
     * @return BelongsTo<ServiceStatus>
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(ServiceStatus::class, 'status_id', 'id');
    }

    /**
     * The systems that belong to the component.
     *
     * @return BelongsToMany<System>
     */
    public function systems(): BelongsToMany
    {
        return $this->belongsToMany(System::class, 'system_components');
    }

    /**
     * Check if the component has systems.
     *
     * @return bool
     */
    public function hasSystems(): bool
    {
        return $this->systems()->exists();
    }

    /**
     * Get the business tier of the component
     *
     * @return BelongsTo<BusinessTier>
     */
    public function tier(): BelongsTo
    {
        return $this->belongsTo(BusinessTier::class, 'tier_id', 'id');
    }
}
