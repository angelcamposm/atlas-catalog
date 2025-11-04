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
     * @param BusinessDomain $business_domain
     *
     * @return BusinessDomainResource
     */
    public function show(BusinessDomain $business_domain): BusinessDomainResource
    {
        return new BusinessDomainResource($business_domain);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateBusinessDomainRequest $request
     * @param BusinessDomain $business_domain
     *
     * @return BusinessDomainResource
     */
    public function update(UpdateBusinessDomainRequest $request, BusinessDomain $business_domain): BusinessDomainResource
    {
        $model = $business_domain->update($request->validated());

        return new BusinessDomainResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param BusinessDomain $business_domain
     *
     * @return Response
     */
    public function destroy(BusinessDomain $business_domain): Response
    {
        $business_domain->delete();

        return response()->noContent();
    }
}
