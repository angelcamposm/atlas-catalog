<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\OrganizationObserver;
use App\Traits\BelongsToUser;
use Database\Factories\OrganizationFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property int $created_by
 * @property int $updated_by
 *
 * @use HasFactory<OrganizationFactory>
 */
#[ObservedBy(OrganizationObserver::class)]
class Organization extends Model
{
    use BelongsToUser;
    use HasFactory;

    protected $table = 'organizations';

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'updated_by',
    ];
}
