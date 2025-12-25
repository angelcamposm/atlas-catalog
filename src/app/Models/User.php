<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserResourceCollection;
use App\Observers\UserObserver;
use App\Traits\BelongsToUser;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Database\Eloquent\Attributes\UseResourceCollection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property int $id
 * @property string $email
 * @property string $name
 * @property string $password
 * @property int $created_by
 * @property int $updated_by
 *
 * @property-read Collection<int, Group> $groups
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static paginate()
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @use HasFactory<UserFactory>
 */
#[ObservedBy(UserObserver::class)]
#[UseResource(UserResource::class)]
#[UseResourceCollection(UserResourceCollection::class)]
class User extends Authenticatable
{
    use BelongsToUser;
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass-assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The groups that the user belongs to.
     *
     * @return BelongsToMany<Group>
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'group_members');
    }

    /**
     * Check if the user has any groups.
     *
     * @return bool
     */
    public function hasGroups(): bool
    {
        return $this->groups()->exists();
    }
}
