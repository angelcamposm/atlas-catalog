<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\JenkinsInstanceObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property int $credential_id
 * @property mixed|string $driver
 * @property bool $is_enabled
 * @property Carbon|null $last_synced_at
 * @property string $url
 * @property int $created_by
 * @property int $updated_by
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @property-read mixed $credential
 * @property-read User|null $creator The user who created this language entry.
 * @property-read User|null $updater The user who last updated this language entry.
 */
#[ObservedBy(JenkinsInstanceObserver::class)]
class JenkinsInstance extends CiServer
{
    //
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'ci_servers';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'driver',
    ];

    /**
     * Bootstrap the model and its traits.
     *
     * @return void
     */
    protected static function boot(): void
    {
        parent::boot();

        JenkinsInstance::addGlobalScope(function ($query) {
            $query->where('driver', 'jenkins');
        });
    }
}
