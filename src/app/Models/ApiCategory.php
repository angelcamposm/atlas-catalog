<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ApiCategoryObserver;
use Database\Factories\ApiCategoryFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string $icon
 * @property string $model
 * @property int $parent_id
 * @property int $created_by
 * @property int $updated_by
 *
 * @property-read Collection<Api>|null $apis The APIs associated with this category.
 * @property-read User|null $creator The user who created this language entry.
 * @property-read User|null $updater The user who last updated this language entry.
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @use HasFactory<ApiCategoryFactory>
 */
#[ObservedBy(ApiCategoryObserver::class)]
class ApiCategory extends Category
{
    use HasFactory;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'model',
    ];

    /**
     * Bootstrap the model and its traits.q
     *
     * @return void
     */
    protected static function boot(): void
    {
        parent::boot();

        static::addGlobalScope(function ($query) {
            $query->where('model', strtolower(class_basename(Api::class)));
        });
    }

    /**
     * Get the APIs associated with this category.
     *
     * @return HasMany<Api>
     */
    public function apis(): HasMany
    {
        return $this->hasMany(Api::class, 'category_id', 'id');
    }
}
