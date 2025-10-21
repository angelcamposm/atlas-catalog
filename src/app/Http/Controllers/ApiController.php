<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreApiRequest;
use App\Http\Requests\UpdateApiRequest;
use App\Http\Resources\ApiResource;
use App\Http\Resources\ApiResourceCollection;
use App\Models\Api;
use Illuminate\Http\Response;

class ApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ApiResourceCollection
     */
    public function index(): ApiResourceCollection
    {
        return new ApiResourceCollection(Api::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreApiRequest $request
     *
     * @return ApiResource
     */
    public function store(StoreApiRequest $request): ApiResource
    {
        $model = Api::create($request->validated());

        return new ApiResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Api $api
     *
     * @return ApiResource
     */
    public function show(Api $api): ApiResource
    {
        return new ApiResource($api);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateApiRequest $request
     * @param Api $api
     *
     * @return ApiResource
     */
    public function update(UpdateApiRequest $request, Api $api): ApiResource
    {
        $model = $api->update($request->validated());

        return new ApiResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Api $api
     *
     * @return Response
     */
    public function destroy(Api $api): Response
    {
        $api->delete();

        return response()->noContent();
    }
}
