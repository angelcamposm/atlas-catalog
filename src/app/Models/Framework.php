<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\FrameworkObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
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
 #[ObservedBy(FrameworkObserver::class)]
class Framework extends Model
{
    //
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'frameworks';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'icon',
        'is_enabled',
        'language_id',
        'url',
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
      * Establishes a relationship to the ProgrammingLanguage model.
      *
      * @return BelongsTo
      */
     public function language(): BelongsTo
     {
         return $this->belongsTo(ProgrammingLanguage::class, 'language_id');
    }
}
