<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\BusinessDomainObserver;
use App\Traits\BelongsToUser;
use App\Traits\HasRelatives;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $display_name
 * @property int $created_by
 * @property int $updated_by
 * @property mixed $parent_id
 * @property BusinessDomain $parent
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 */
#[ObservedBy(BusinessDomainObserver::class)]
class BusinessDomain extends Model
{
    use BelongsToUser;
    use HasRelatives;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'business_domains';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'display_name',
        'category',
        'is_active',
        'parent_id',
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
}
