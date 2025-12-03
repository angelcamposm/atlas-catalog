<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\WorkflowJobObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $component_id
 * @property string $name
 * @property string $display_name
 * @property string $description
 * @property string $discovery_source
 * @property bool $is_enabled
 * @property string $url
 * @property string $created_at
 * @property int $created_by
 * @property string $updated_at
 * @property int $updated_by
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @property-read Component $component The component associated with this language entry.
 * @property-read User|null $creator The user who created this language entry.
 * @property-read User|null $updater The user who last updated this language entry.
 */
#[ObservedBy(WorkflowJobObserver::class)]
class WorkflowJob extends Model
{
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'workflow_jobs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'component_id',
        'display_name',
        'description',
        'discovery_source',
        'is_enabled',
        'url',
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
     * Get the component associated with this WorkflowJob.
     *
     * @return BelongsTo<Component>
     */
    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class, 'component_id', 'id');
    }

    /**
     * Check if the workflow job has a component.
     *
     * @return bool
     */
    public function hasComponent(): bool
    {
        return $this->component_id !== null;
    }

    /**
     * Check if the workflow job is enabled.
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return $this->is_enabled;
    }

    /**
     * Check if the workflow job has workflow runs.
     *
     * @return bool
     */
    public function hasWorkflowRuns(): bool
    {
        return $this->workflowRuns()->exists();
    }

    /**
     * Get the workflow runs associated with this WorkflowJob.
     *
     * @return HasMany<WorkflowRun>
     */
    public function workflowRuns(): HasMany
    {
        return $this->hasMany(WorkflowRun::class, 'workflow_job_id', 'id');
    }
}
