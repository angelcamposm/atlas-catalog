<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\GroupMemberObserver;
use App\Traits\BelongsToUser;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @property int $id
 * @property int $group_id
 * @property int $user_id
 * @property int $created_by
 * @property int $updated_by
 */
#[ObservedBy(GroupMemberObserver::class)]
class GroupMember extends Pivot
{
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'group_member';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'group_id',
        'is_active',
        'role_id',
        'user_id',
        'created_by',
        'updated_by',
    ];

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;
}
