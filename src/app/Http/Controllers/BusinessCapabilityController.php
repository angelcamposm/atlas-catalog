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
     * Define the allowed relationships for the show method.
     *
     * @var array<int, string>
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
     * @return BusinessCapabilityResourceCollection
     */
    public function index(): BusinessCapabilityResourceCollection
    {
        return new BusinessCapabilityResourceCollection(BusinessCapability::paginate());
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
     * @param  BusinessCapability  $businessCapability
     *
     * @return BusinessCapabilityResource
     */
    public function show(Request $request, BusinessCapability $businessCapability): BusinessCapabilityResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $businessCapability->load($allowedRelationships);
        }

        return new BusinessCapabilityResource($businessCapability);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateBusinessCapabilityRequest $request
     * @param BusinessCapability $businessCapability
     *
     * @return BusinessCapabilityResource
     */
    public function update(UpdateBusinessCapabilityRequest $request, BusinessCapability $businessCapability): BusinessCapabilityResource
    {
        $model = $businessCapability->update($request->validated());

        return new BusinessCapabilityResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param BusinessCapability $businessCapability
     *
     * @return Response
     */
    public function destroy(BusinessCapability $businessCapability): Response
    {
        $businessCapability->delete();

        return response()->noContent();
    }
}
