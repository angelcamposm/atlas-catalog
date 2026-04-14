<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessCapabilityRequest;
use App\Http\Requests\UpdateBusinessCapabilityRequest;
use App\Http\Resources\BusinessCapabilityResource;
use App\Http\Resources\BusinessCapabilityResourceCollection;
use App\Models\BusinessCapability;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BusinessCapabilityController extends Controller
{
    use AllowedRelationships;

    /**
     * List of allowed relationships that can be eagerly loaded for BusinessCapability resources.
     *
     * These relationships can be included in API responses by passing them via the 'with' query parameter.
     * Available relationships:
     * - children: Child business capabilities in the hierarchy
     * - creator: User who created the business capability
     * - parent: Parent business capability in the hierarchy
     * - systems: Systems associated with this business capability
     * - updater: User who last updated the business capability
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'children',
        'creator',
        'parent',
        'systems',
        'updater',
    ];

    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     *
     * @return BusinessCapabilityResourceCollection
     */
    public function index(Request $request): BusinessCapabilityResourceCollection
    {
        $requestedRelationships = $request->has('with')
                ? self::filterAllowedRelationships($request->get('with'))
                : [];

        return new BusinessCapabilityResourceCollection(
            BusinessCapability::filter($request)
                ->search($request)
                ->sort($request)
                ->with($requestedRelationships)
                ->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreBusinessCapabilityRequest $request
     *
     * @return BusinessCapabilityResource
     */
    public function store(StoreBusinessCapabilityRequest $request): BusinessCapabilityResource
    {
        $model = BusinessCapability::create($request->validated());

        return new BusinessCapabilityResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request             $request
     * @param  BusinessCapability  $business_capability
     *
     * @return BusinessCapabilityResource
     */
    public function show(Request $request, BusinessCapability $business_capability): BusinessCapabilityResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $business_capability->load($allowedRelationships);
        }

        return new BusinessCapabilityResource($business_capability);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateBusinessCapabilityRequest $request
     * @param BusinessCapability $business_capability
     *
     * @return BusinessCapabilityResource
     */
    public function update(UpdateBusinessCapabilityRequest $request, BusinessCapability $business_capability): BusinessCapabilityResource
    {
        $model = tap($business_capability)->update($request->validated());

        return new BusinessCapabilityResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param BusinessCapability $business_capability
     *
     * @return Response
     */
    public function destroy(BusinessCapability $business_capability): Response
    {
        $this->authorize('delete', $business_capability);

        $business_capability->delete();

        return response()->noContent();
    }
}
