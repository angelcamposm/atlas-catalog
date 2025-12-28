<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\LinkObserver;
use App\Traits\BelongsToUser;
use Database\Factories\LinkFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Represents a generic link that can be attached to any other model.
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $model_name
 * @property int $model_id
 * @property int|null $type_id
 * @property string $url
 * @property Carbon|null $created_at
 * @property int $created_by
 * @property Carbon|null $updated_at
 * @property int $updated_by
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @use HasFactory<LinkFactory>
 */
#[ObservedBy(LinkObserver::class)]
class Link extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'links';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'category_id',
        'description',
        'model_name',
        'model_id',
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
     * Get the type of the link.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(LinkCategory::class, 'category_id', 'id');
    }
}
