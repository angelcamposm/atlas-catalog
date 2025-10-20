<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreApiStatusRequest;
use App\Http\Requests\UpdateApiStatusRequest;
use App\Http\Resources\ApiStatusResource;
use App\Http\Resources\ApiStatusResourceCollection;
use App\Models\ApiStatus;
use Illuminate\Http\Response;

/**
 * @group Status
 * @authenticated
 */
class ApiStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ApiStatusResourceCollection
     */
    public function index(): ApiStatusResourceCollection
    {
        return new ApiStatusResourceCollection(ApiStatus::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreApiStatusRequest $request
     * @return ApiStatusResource
     */
    public function store(StoreApiStatusRequest $request): ApiStatusResource
    {
        $apiStatus = ApiStatus::create($request->validated());

        return new ApiStatusResource($apiStatus);
    }

    /**
     * Display the specified resource.
     *
     * @param ApiStatus $apiStatus
     * @return ApiStatusResource
     */
    public function show(ApiStatus $apiStatus): ApiStatusResource
    {
        return new ApiStatusResource($apiStatus);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateApiStatusRequest $request
     * @param ApiStatus $apiStatus
     * @return ApiStatusResource
     */
    public function update(UpdateApiStatusRequest $request, ApiStatus $apiStatus): ApiStatusResource
    {
        $apiStatus->update($request->validated());

        return new ApiStatusResource($apiStatus);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ApiStatus $apiStatus
     * @return Response
     */
    public function destroy(ApiStatus $apiStatus): Response
    {
        $apiStatus->delete();

        return response()->noContent();
    }
}
