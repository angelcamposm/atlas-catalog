<?php

declare(strict_types=1);

namespace App\Models;

use App\Http\Resources\ReleaseResource;
use App\Http\Resources\ReleaseResourceCollection;
use App\Observers\ReleaseObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ReleaseFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Database\Eloquent\Attributes\UseResourceCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $component_id
 * @property int|null $workflow_run_id
 * @property string|null $changelog
 * @property array|null $metadata
 * @property string $released_at
 * @property string $status
 * @property string $version
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
 * @use HasFactory<ReleaseFactory>
 */
#[ObservedBy(ReleaseObserver::class)]
#[UseFactory(ReleaseFactory::class)]
#[UseResource(ReleaseResource::class)]
#[UseResourceCollection(ReleaseResourceCollection::class)]
class Release extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'releases';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'component_id',
        'workflow_run_id',
        'version',
        'status',
        'changelog',
        'metadata',
        'released_at',
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
            'metadata' => 'array',
            'released_at' => 'datetime',
        ];
    }

    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class);
    }

    /**
     * Get the workflow run associated with the release.
     *
     * @return BelongsTo
     */
    public function workflowRun(): BelongsTo
    {
        return $this->belongsTo(WorkflowRun::class);
    }

    /**
     * Get the artifacts associated with the release.
     *
     * @return HasMany
     */
    public function artifacts(): HasMany
    {
        return $this->hasMany(ReleaseArtifact::class);
    }
}
