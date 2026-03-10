<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ComplianceRequirementObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ComplianceRequirementFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $severity
 * @property int $created_by
 * @property int $updated_by
 *
 * @use HasFactory<ComplianceRequirementFactory>
 */
#[ObservedBy(ComplianceRequirementObserver::class)]
class ComplianceRequirement extends Model
{
    use BelongsToUser;
    use HasFactory;

    protected $table = 'compliance_requirements';

    protected $fillable = [
        'name',
        'description',
        'severity',
        'created_by',
        'updated_by',
    ];
}
