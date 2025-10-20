<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $name
 * @property string|null $description
 * @property int $created_by
 * @property int $updated_by
 * @method static firstOrCreate(array $array, array $array1)
 * @method static paginate()
 * @method static create(array $validated)
 */
class ApiStatus extends Model
{
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'api_statuses';

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
}
