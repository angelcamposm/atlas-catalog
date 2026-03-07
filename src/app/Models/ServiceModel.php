<?php

declare(strict_types=1);

namespace App\Models;

use App\Http\Resources\ServiceModelResource;
use App\Http\Resources\ServiceModelResourceCollection;
use App\Observers\ServiceModelObserver;
use App\Traits\BelongsToUser;
use App\Traits\Filterable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use Database\Factories\ServiceModelFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Database\Eloquent\Attributes\UseResourceCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $abbrv
 * @property string $display_name
 * @property string $description
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
 * @use HasFactory<ServiceModelFactory>
 */
#[ObservedBy(ServiceModelObserver::class)]
#[UseResource(ServiceModelResource::class)]
#[UseResourceCollection(ServiceModelResourceCollection::class)]
class ServiceModel extends Model
{
    use BelongsToUser;
    use Filterable;
    use HasFactory;
    use Searchable;
    use Sortable;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'service_models';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'abbrv',
        'display_name',
        'description',
        'created_by',
        'updated_by',
    ];

    /**
     * Fields that can be filtered.
     *
     * @var array<string>
     */
    protected array $filterable = [];

    /**
     * Fields that can be searched.
     *
     * @var array<string>
     */
    protected array $searchable = [
        'name',
        'display_name',
        'description',
        'abbrv',
    ];

    /**
     * Fields that can be sorted.
     *
     * @var array<string>
     */
    protected array $sortable = [
        'id',
        'name',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        //
    ];
}
