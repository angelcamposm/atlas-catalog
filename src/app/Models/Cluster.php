<?php

declare(strict_types=1);

namespace App\Models;

use App\Http\Resources\ClusterResource;
use App\Http\Resources\ClusterResourceCollection;
use App\Observers\ClusterObserver;
use App\Traits\BelongsToUser;
use Database\Factories\ClusterFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Database\Eloquent\Attributes\UseResourceCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string|null $api_url
 * @property string|null $cluster_uuid
 * @property string|null $description
 * @property string|null $display_name
 * @property string|null $full_version
 * @property bool $has_licensing
 * @property string|null $licensing_model
 * @property int|null $lifecycle_id
 * @property string $name
 * @property string|null $tags
 * @property string|null $timezone
 * @property int|null $vendor_id
 * @property string|null $version
 * @property string|null $url
 * @property int $created_by
 * @property int $updated_by
 * @property-read InfrastructureType|null $infrastructureType
 * @property-read LifecyclePhase|null $lifecycle
 * @property-read Node[] $nodes
 * @property-read ServiceAccount[] $serviceAccounts
 * @property-read ServiceAccount[] $serviceAccount
 * @property-read ClusterType|null $type
 *
 * @method static create(array $validated)
 * @method static firstOrCreate(array $attributes = [], array $values = [])
 * @method static inRandomOrder()
 * @method static paginate()
 * @method static pluck(string $string)
 * @method static updateOrCreate(array $attributes = [], array $values = [])
 *
 * @use HasFactory<ClusterFactory>
 */
#[ObservedBy(ClusterObserver::class)]
#[UseFactory(ClusterFactory::class)]
#[UseResource(ClusterResource::class)]
#[UseResourceCollection(ClusterResourceCollection::class)]
class Cluster extends Model
{
    use BelongsToUser;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table = 'clusters';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'api_url',
        'cluster_uuid',
        'display_name',
        'full_version',
        'has_licensing',
        'infrastructure_type_id',
        'licensing_model',
        'lifecycle_id',
        'tags',
        'timezone',
        'vendor_id',
        'version',
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
     * Check if the cluster has a licensing model applied.
     *
     * @return bool
     */
    public function hasLicensing(): bool
    {
        return $this->has_licensing;
    }

    /**
     * Get the infrastructure type of the cluster.
     *
     * @return BelongsTo<InfrastructureType>
     */
    public function infrastructureType(): BelongsTo
    {
        return $this->belongsTo(InfrastructureType::class, 'infrastructure_type_id', 'id');
    }

    /**
     * Get the lifecycle of the cluster.
     *
     * @return BelongsTo<LifecyclePhase>
     */
    public function lifecycle(): BelongsTo
    {
        return $this->belongsTo(LifecyclePhase::class, 'lifecycle_id', 'id');
    }

    /**
     * Get the nodes associated with the cluster.
     *
     * @return BelongsToMany<Node>
     */
    public function nodes(): BelongsToMany
    {
        return $this->belongsToMany(
            related: Node::class,
            table: ClusterNode::class,
            foreignPivotKey: 'cluster_id',
            relatedPivotKey: 'node_id',
            parentKey: 'id',
            relatedKey: 'id',
        );
    }

    /**
     * Get the Service Accounts for this cluster.
     *
     * @return BelongsToMany<ServiceAccount>
     */
    public function service_accounts(): BelongsToMany
    {
        return $this->belongsToMany(
            related: ServiceAccount::class,
            table: ClusterServiceAccount::class,
            foreignPivotKey: 'cluster_id',
            relatedPivotKey: 'service_account_id',
            parentKey: 'id',
            relatedKey: 'id',
        );
    }

    /**
     * Get the type of the cluster.
     *
     * @return BelongsTo<ClusterType>
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(ClusterType::class, 'type_id', 'id');
    }
}
