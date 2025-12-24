<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\NodeResourceCollection;
use App\Models\Cluster;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;

class ClusterNodeController extends Controller
{
    use AllowedRelationships;

    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'updater',
    ];

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Cluster $cluster): NodeResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        $nodes = $cluster->nodes()->with($requestedRelationships)->paginate();

        return new NodeResourceCollection($nodes);
    }
}
