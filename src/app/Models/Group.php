<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\GroupObserver;
use App\Traits\BelongsToUser;
use App\Traits\Filterable;
use App\Traits\HasIcon;
use App\Traits\HasRelatives;
use App\Traits\Searchable;
use App\Traits\Sortable;
use Database\Factories\GroupFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $description
 * @property string $email
 * @property string $icon
 * @property string $label
 * @property string $name
 * @property int $parent_id
 * @property int $type_id
 * @property int $created_by
 * @property int $updated_by
 *
 * @property-read GroupType|null $type
 * @property-read Collection<int, User> $users
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @use HasFactory<GroupFactory>
 */
#[ObservedBy(GroupObserver::class)]
class Group extends Model
{
    use BelongsToUser;
    use HasFactory;
    use HasIcon;
    use HasRelatives;
    use Filterable;
    use Sortable;
    use Searchable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'groups';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'email',
        'icon',
        'label',
        'parent_id',
        'type_id',
        'created_by',
        'updated_by',
    ];
    /**
     * Fields that can be filtered.
     *
     * @var array<string>
     */
    protected array \$filterable = [
        'type_id',
    ];

    /**
     * Fields that can be sorted.
     *
     * @var array<string>
     */
    protected array \$sortable = [
        'id',
        'name',
        'created_at',
        'updated_at',
    ];

    /**
     * Fields that can be searched.
     *
     * @var array<string>
     */
    protected array \$searchable = [
        'name',
        'email',
        'description',
    ];
    /**
     * The users that belong to the group.
     *
     * @return BelongsToMany<User>
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_members')
            ->withPivot(['is_active', 'role_id']);
    }

    /**
     * Check if the group has any users.
     *
     * @return bool
     */
    public function hasMembers(): bool
    {
        return $this->members()->exists();
    }

    /**
     * Get the group type.
     *
     * @return BelongsTo<GroupType>
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(GroupType::class, 'type_id', 'id');
    }
}
