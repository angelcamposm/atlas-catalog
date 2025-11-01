<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreApiCategoryRequest;
use App\Http\Requests\UpdateApiCategoryRequest;
use App\Http\Resources\ApiCategoryResource;
use App\Http\Resources\ApiCategoryResourceCollection;
use App\Models\ApiCategory;
use Illuminate\Http\Response;

class ApiCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ApiCategoryResourceCollection
     */
    public function index(): ApiCategoryResourceCollection
    {
        return new ApiCategoryResourceCollection(ApiCategory::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreApiCategoryRequest $request
     *
     * @return ApiCategoryResource
     */
    public function store(StoreApiCategoryRequest $request): ApiCategoryResource
    {
        $model = ApiCategory::create($request->validated());

        return new ApiCategoryResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ApiCategory $apiCategory
     *
     * @return ApiCategoryResource
     */
    public function show(ApiCategory $apiCategory): ApiCategoryResource
    {
        return new ApiCategoryResource($apiCategory);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateApiCategoryRequest $request
     * @param ApiCategory $apiCategory
     *
     * @return ApiCategoryResource
     */
    public function update(UpdateApiCategoryRequest $request, ApiCategory $apiCategory): ApiCategoryResource
    {
        $model = $apiCategory->update($request->validated());

        return new ApiCategoryResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ApiCategory $apiCategory
     *
     * @return Response
     */
    public function destroy(ApiCategory $apiCategory): Response
    {
        $apiCategory->delete();

        return response()->noContent();
    }
}
