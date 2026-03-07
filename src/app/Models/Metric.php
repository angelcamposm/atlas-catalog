<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\BelongsToUser;
use App\Traits\Filterable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use Database\Factories\MetricFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $name
 * @property float $value
 * @property string|null $unit
 * @property int $metric_definition_id
 * @property int|null $component_id
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property-read MetricDefinition $definition
 * @property-read Component|null $component
 * @property-read User|null $creator
 * @property-read User|null $updater
 *
 * @use HasFactory<MetricFactory>
 */
class Metric extends Model
{
    use BelongsToUser;
    use Filterable;
    use HasFactory;
    use Searchable;
    use Sortable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'metrics';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'value',
        'unit',
        'metric_definition_id',
        'component_id',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'float',
    ];

    /**
     * Get the metric definition for this metric.
     *
     * @return BelongsTo<MetricDefinition, Metric>
     */
    public function definition(): BelongsTo
    {
        return $this->belongsTo(MetricDefinition::class);
    }

    /**
     * Get the component associated with this metric.
     *
     * @return BelongsTo<Component, Metric>
     */
    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class);
    }
}
