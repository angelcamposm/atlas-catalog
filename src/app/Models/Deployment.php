<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DeploymentStatus;
use App\Observers\DeploymentObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $component_id
 * @property int $environment_id
 * @property int|null $cluster_id
 * @property int|null $release_id
 * @property string|null $version
 * @property string|null $commit_hash
 * @property string|null $docker_image_digest
 * @property int|null $workflow_run_id
 * @property int|null $triggered_by
 * @property DeploymentStatus $status
 * @property Carbon $started_at
 * @property Carbon|null $ended_at
 * @property int|null $duration_milliseconds
 * @property array|null $meta
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
#[ObservedBy(DeploymentObserver::class)]
class Deployment extends Model
{
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'deployments';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'component_id',
        'environment_id',
        'cluster_id',
        'release_id',
        'version',
        'commit_hash',
        'docker_image_digest',
        'workflow_run_id',
        'triggered_by',
        'status',
        'started_at',
        'ended_at',
        'duration_milliseconds',
        'meta',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'status' => DeploymentStatus::class,
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'meta' => 'array',
    ];

    /**
     * Define a relationship to the Component model.
     *
     * @return BelongsTo The relationship instance connecting this model to the Component model.
     */
    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class);
    }

    public function environment(): BelongsTo
    {
        return $this->belongsTo(Environment::class);
    }

    public function cluster(): BelongsTo
    {
        return $this->belongsTo(Cluster::class);
    }

    public function release(): BelongsTo
    {
        return $this->belongsTo(Release::class);
    }

    public function workflowRun(): BelongsTo
    {
        return $this->belongsTo(WorkflowRun::class);
    }

    public function triggerer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'triggered_by');
    }

    public function scopeSuccessful(Builder $query): void
    {
        $query->where('status', DeploymentStatus::Success);
    }

    public function scopeProduction(Builder $query): void
    {
        $query->whereHas('environment', function ($q) {
            $q->where('is_production_environment', true);
        });
    }
}
