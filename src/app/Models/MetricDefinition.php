<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\BelongsToUser;
use App\Traits\Filterable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use Database\Factories\MetricDefinitionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $unit
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property-read User|null $creator
 * @property-read User|null $updater
 *
 * @use HasFactory<MetricDefinitionFactory>
 */
class MetricDefinition extends Model
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
    protected $table = 'metric_definitions';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'unit',
        'created_by',
        'updated_by',
    ];

    /**
     * Get the metrics for this definition.
     *
     * @return HasMany<Metric>
     */
    public function metrics(): HasMany
    {
        return $this->hasMany(Metric::class);
    }
}
