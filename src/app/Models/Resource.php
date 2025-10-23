<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ResourceObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ResourceFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $name
 * @property int $created_by
 * @property int $updated_by
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 */
 #[ObservedBy(ResourceObserver::class)]
class Resource extends Model
{
     /**
      * @use HasFactory<ResourceFactory>
      */
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'resources';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type_id',
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
      * @return BelongsTo<ResourceType>
      */
    public function type(): BelongsTo
    {
        return $this->belongsTo(ResourceType::class, 'type_id', 'id');
    }
}
