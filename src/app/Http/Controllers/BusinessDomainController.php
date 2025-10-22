<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessDomainRequest;
use App\Http\Requests\UpdateBusinessDomainRequest;
use App\Http\Resources\BusinessDomainResource;
use App\Http\Resources\BusinessDomainResourceCollection;
use App\Models\BusinessDomain;
use Illuminate\Http\Response;

class BusinessDomainController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return BusinessDomainResourceCollection
     */
    public function index(): BusinessDomainResourceCollection
    {
        return new BusinessDomainResourceCollection(BusinessDomain::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreBusinessDomainRequest $request
     *
     * @return BusinessDomainResource
     */
    public function store(StoreBusinessDomainRequest $request): BusinessDomainResource
    {
        $model = BusinessDomain::create($request->validated());

        return new BusinessDomainResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param BusinessDomain $businessDomain
     *
     * @return BusinessDomainResource
     */
    public function show(BusinessDomain $businessDomain): BusinessDomainResource
    {
        return new BusinessDomainResource($businessDomain);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateBusinessDomainRequest $request
     * @param BusinessDomain $businessDomain
     *
     * @return BusinessDomainResource
     */
    public function update(UpdateBusinessDomainRequest $request, BusinessDomain $businessDomain): BusinessDomainResource
    {
        $model = $businessDomain->update($request->validated());

        return new BusinessDomainResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param BusinessDomain $businessDomain
     *
     * @return Response
     */
    public function destroy(BusinessDomain $businessDomain): Response
    {
        $businessDomain->delete();

        return response()->noContent();
    }
}
