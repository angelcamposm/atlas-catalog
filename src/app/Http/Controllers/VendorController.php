<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;
use App\Http\Resources\VendorResource;
use App\Http\Resources\VendorResourceCollection;
use App\Models\Vendor;
use Illuminate\Http\Response;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return VendorResourceCollection
     */
    public function index(): VendorResourceCollection
    {
        return new VendorResourceCollection(Vendor::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreVendorRequest $request
     *
     * @return VendorResource
     */
    public function store(StoreVendorRequest $request): VendorResource
    {
        $model = Vendor::create($request->validated());

        return new VendorResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Vendor $vendor
     *
     * @return VendorResource
     */
    public function show(Vendor $vendor): VendorResource
    {
        return new VendorResource($vendor);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateVendorRequest $request
     * @param Vendor $vendor
     *
     * @return VendorResource
     */
    public function update(UpdateVendorRequest $request, Vendor $vendor): VendorResource
    {
        $model = $vendor->update($request->validated());

        return new VendorResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Vendor $vendor
     *
     * @return Response
     */
    public function destroy(Vendor $vendor): Response
    {
        $vendor->delete();

        return response()->noContent();
    }
}
