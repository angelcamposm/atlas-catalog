<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\NodeObserver;
use App\Traits\BelongsToUser;
use Database\Factories\NodeFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
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
 * @use HasFactory<NodeFactory>
 */
#[ObservedBy(NodeObserver::class)]
class Node extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'nodes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'discovery_source',
        'cpu_architecture',
        'cpu_sockets',
        'cpu_cores',
        'cpu_threads',
        'smt_enabled',
        'ip_address',
        'mac_address',
        'memory_bytes',
        'hostname',
        'fqdn',
        'node_type',
        'os',
        'os_version',
        'timezone',
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
