<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ComponentResourceCollection;
use App\Models\BusinessDomain;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;

class BusinessDomainComponentController extends Controller
{
    use AllowedRelationships;

    /**
     * List of allowed relationships that can be eagerly loaded for Component resources.
     *
     * Available relationships:
     *   - creator: User who created the business capability
     *   - domain: Business Domain associated with the components.
     *   - platform: Platform of the components.
     *   - status: Service status of the components.
     *   - updater: User who last updated the business capability
     *
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'domain',
        'owner',
        'platform',
        'status',
        'updater',
    ];

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, BusinessDomain $businessDomain): ComponentResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        $components = $businessDomain->components()->with($requestedRelationships)->paginate();

        return new ComponentResourceCollection($components);
    }
}
