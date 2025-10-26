<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ProgrammingLanguageObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $icon
 * @property bool $is_enabled
 * @property string $name
 * @property string $url
 * @property int $created_by
 * @property int $updated_by
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 */
#[ObservedBy(ProgrammingLanguageObserver::class)]
class ProgrammingLanguage extends Model
{
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'programming_languages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'icon',
        'is_enabled',
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
     * Get the frameworks associated with the programming language.
     *
     * @return HasMany<Framework>
     */
    public function frameworks(): HasMany
    {
        return $this->hasMany(Framework::class, 'language_id');
    }
}
