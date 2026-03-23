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
     * @param ApiType $api_type
     *
     * @return ApiTypeResource
     */
    public function show(ApiType $api_type): ApiTypeResource
    {
        return new ApiTypeResource($api_type);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateApiTypeRequest $request
     * @param ApiType $api_type
     *
     * @return ApiTypeResource
     */
    public function update(UpdateApiTypeRequest $request, ApiType $api_type): ApiTypeResource
    {
        $model = tap($api_type)->update($request->validated());

        return new ApiTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ApiType $api_type
     *
     * @return Response
     */
    public function destroy(ApiType $api_type): Response
    {
        $api_type->delete();

        return response()->noContent();
    }
}
