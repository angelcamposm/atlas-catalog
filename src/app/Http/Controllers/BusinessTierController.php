<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessTierRequest;
use App\Http\Requests\UpdateBusinessTierRequest;
use App\Http\Resources\BusinessTierResource;
use App\Http\Resources\BusinessTierResourceCollection;
use App\Models\BusinessTier;
use Illuminate\Http\Response;

class BusinessTierController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return BusinessTierResourceCollection
     */
    public function index(): BusinessTierResourceCollection
    {
        return new BusinessTierResourceCollection(BusinessTier::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreBusinessTierRequest $request
     *
     * @return BusinessTierResource
     */
    public function store(StoreBusinessTierRequest $request): BusinessTierResource
    {
        $model = BusinessTier::create($request->validated());

        return new BusinessTierResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param BusinessTier $business_tier
     *
     * @return BusinessTierResource
     */
    public function show(BusinessTier $business_tier): BusinessTierResource
    {
        return new BusinessTierResource($business_tier);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateBusinessTierRequest $request
     * @param BusinessTier $business_tier
     *
     * @return BusinessTierResource
     */
    public function update(UpdateBusinessTierRequest $request, BusinessTier $business_tier): BusinessTierResource
    {
        $model = $business_tier->update($request->validated());

        return new BusinessTierResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param BusinessTier $business_tier
     *
     * @return Response
     */
    public function destroy(BusinessTier $business_tier): Response
    {
        $business_tier->delete();

        return response()->noContent();
    }
}
