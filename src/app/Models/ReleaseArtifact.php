<?php

declare(strict_types=1);

namespace App\Models;

use App\Http\Resources\ReleaseArtifactResource;
use App\Http\Resources\ReleaseArtifactResourceCollection;
use App\Observers\ReleaseArtifactObserver;
use App\Traits\Filterable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use Database\Factories\ReleaseArtifactFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Database\Eloquent\Attributes\UseResourceCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $release_id
 * @property string $name
 * @property string $type
 * @property string $url
 * @property string $digest_md5
 * @property string $digest_sha1
 * @property string $digest_sha256
 * @property int $size_bytes
 * @property int $created_by
 * @property int $updated_by
 * @method static create(mixed $validated)
 */
#[ObservedBy(ReleaseArtifactObserver::class)]
#[UseFactory(ReleaseArtifactFactory::class)]
#[UseResource(ReleaseArtifactResource::class)]
#[UseResourceCollection(ReleaseArtifactResourceCollection::class)]
class ReleaseArtifact extends Model
{
    use HasFactory;
    use Filterable;
    use Searchable;
    use Sortable;

    protected $table = 'release_artifacts';

    protected $fillable = [
        'release_id',
        'type',
        'name',
        'url',
        'digest_md5',
        'digest_sha1',
        'digest_sha256',
        'size_bytes',
    ];

    /**
     * Fields that can be filtered.
     *
     * @var array<string>
     */
    protected array $filterable = [
        'release_id',
        'type',
    ];

    /**
     * Fields that can be searched.
     *
     * @var array<string>
     */
    protected array $searchable = [
        'name',
        'url',
    ];

    /**
     * Fields that can be sorted.
     *
     * @var array<string>
     */
    protected array $sortable = [
        'id',
        'name',
        'type',
        'created_at',
        'updated_at',
    ];

    public function release(): BelongsTo
    {
        return $this->belongsTo(Release::class);
    }
}
