<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ServiceAccountResourceCollection;
use App\Models\Cluster;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;

class ClusterServiceAccountController extends Controller
{
    use AllowedRelationships;

    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'tokens',
        'updater',
    ];

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Cluster $cluster): ServiceAccountResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        $service_accounts = $cluster->service_accounts()->with($requestedRelationships)->paginate();

        return new ServiceAccountResourceCollection($service_accounts);
    }
}
