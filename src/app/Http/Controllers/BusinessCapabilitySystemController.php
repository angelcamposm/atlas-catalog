<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\BusinessCapabilityResourceCollection;
use App\Models\BusinessCapability;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;

class BusinessCapabilitySystemController extends Controller
{
    use AllowedRelationships;

    /**
     * List of allowed relationships that can be eagerly loaded for BusinessCapability resources.
     * These relationships can be included in API responses by passing them via the 'with' query parameter.
     * Available relationships:
     *   - components: Components associated with this business capability
     *   - creator: User who created the business capability
     *   - updater: User who last updated the business capability
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'components',
        'creator',
        'updater',
    ];

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, BusinessCapability $businessCapability): BusinessCapabilityResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        $components = $businessCapability->systems()->with($requestedRelationships)->paginate();

        return new BusinessCapabilityResourceCollection($components);
    }
}
