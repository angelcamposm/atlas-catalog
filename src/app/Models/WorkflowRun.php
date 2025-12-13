<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\WorkflowRunResult;
use App\Observers\WorkflowRunObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $workflow_job_id
 * @property string $description
 * @property string $display_name
 * @property string $duration_milliseconds
 * @property bool $is_enabled
 * @property WorkflowRunResult $result
 * @property string|null $url
 * @property Carbon|null $started_at
 * @property int|null $started_by
 * @property int $created_by
 * @property int $updated_by
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @property-read User|null $creator The user who created this language entry.
 * @property-read User|null $updater The user who last updated this language entry.
 * @property-read WorkflowJob $workflowJob The workflow job associated with this run.
 */
#[ObservedBy(WorkflowRunObserver::class)]
class WorkflowRun extends Model
{
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'workflow_runs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'workflow_job_id',
        'description',
        'display_name',
        'duration_milliseconds',
        'is_enabled',
        'result',
        'url',
        'started_at',
        'started_by',
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
     * @var array<string, string>
     */
    protected $casts = [
        'status' => WorkflowRunResult::class,
        'started_at' => 'datetime',
    ];

    /**
     * Get the workflow job associated with this run.
     *
     * @return BelongsTo<WorkflowJob>
     */
    public function workflowJob(): BelongsTo
    {
        return $this->belongsTo(WorkflowJob::class, 'workflow_job_id', 'id');
    }
}
