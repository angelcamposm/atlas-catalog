<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ApiAccessPolicyObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string|null $description
 * @property string $name
 * @property int $created_by
 * @property int $updated_by
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $array, array $array1)
 */
#[ObservedBy(ApiAccessPolicyObserver::class)]
class ApiAccessPolicy extends Model
{
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'api_access_policies';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
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
