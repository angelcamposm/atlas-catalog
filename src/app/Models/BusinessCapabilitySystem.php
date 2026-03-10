<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\BusinessCapabilitySystemObserver;
use App\Traits\BelongsToUser;
use Database\Factories\BusinessCapabilitySystemFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $business_capability_id
 * @property int $system_id
 * @property int $created_by
 * @property int $updated_by
 *
 * @use HasFactory<BusinessCapabilitySystemFactory>
 */
#[ObservedBy(BusinessCapabilitySystemObserver::class)]
class BusinessCapabilitySystem extends Model
{
    use BelongsToUser;
    use HasFactory;

    protected $table = 'business_capability_system';

    protected $fillable = [
        'business_capability_id',
        'system_id',
        'created_by',
        'updated_by',
    ];

    public function businessCapability(): BelongsTo
    {
        return $this->belongsTo(BusinessCapability::class, 'business_capability_id');
    }

    public function system(): BelongsTo
    {
        return $this->belongsTo(System::class, 'system_id');
    }
}
