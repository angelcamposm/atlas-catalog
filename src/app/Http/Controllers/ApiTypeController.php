<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreApiTypeRequest;
use App\Http\Requests\UpdateApiTypeRequest;
use App\Http\Resources\ApiTypeResource;
use App\Http\Resources\ApiTypeResourceCollection;
use App\Models\ApiType;
use Illuminate\Http\Response;

class ApiTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ApiTypeResourceCollection
     */
    public function index(): ApiTypeResourceCollection
    {
        return new ApiTypeResourceCollection(ApiType::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreApiTypeRequest $request
     *
     * @return ApiTypeResource
     */
    public function store(StoreApiTypeRequest $request): ApiTypeResource
    {
        $model = ApiType::create($request->validated());

        return new ApiTypeResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ApiType $apiType
     *
     * @return ApiTypeResource
     */
    public function show(ApiType $apiType): ApiTypeResource
    {
        return new ApiTypeResource($apiType);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateApiTypeRequest $request
     * @param ApiType $apiType
     *
     * @return ApiTypeResource
     */
    public function update(UpdateApiTypeRequest $request, ApiType $apiType): ApiTypeResource
    {
        $model = $apiType->update($request->validated());

        return new ApiTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ApiType $apiType
     *
     * @return Response
     */
    public function destroy(ApiType $apiType): Response
    {
        $apiType->delete();

        return response()->noContent();
    }
}
