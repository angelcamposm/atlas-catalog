<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\BelongsToUser;
use Database\Factories\ApiFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $created_by
 * @property int $updated_by
 * @method static create(array $validated)
 * @method static inRandomOrder()
 * @method static paginate()
 */
class Api extends Model
{
    /**
     * @use HasFactory<ApiFactory>
     */
    use HasFactory;
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'apis';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'access_policy_id',
        'authentication_method_id',
        'protocol',
        'document_specification',
        'status_id',
        'type_id',
        'url',
        'version',
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
