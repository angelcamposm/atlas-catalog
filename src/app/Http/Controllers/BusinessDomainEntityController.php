<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\EntityResourceCollection;
use App\Models\BusinessDomain;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;

class BusinessDomainEntityController extends Controller
{
    use AllowedRelationships;

    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'updater',
    ];

    /**
     * Handle the incoming request.
     *
     * @param  Request         $request
     * @param  BusinessDomain  $businessDomain
     *
     * @return EntityResourceCollection
     */
    public function __invoke(Request $request, BusinessDomain $businessDomain): EntityResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        $components = $businessDomain->entities()->with($requestedRelationships)->paginate();

        return new EntityResourceCollection($components);
    }
}
