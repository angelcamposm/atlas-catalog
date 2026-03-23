<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CategoryResourceCollection;
use App\Models\ResourceCategory;
use Illuminate\Http\Response;

class ResourceCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return CategoryResourceCollection
     */
    public function index(): CategoryResourceCollection
    {
        return new CategoryResourceCollection(ResourceCategory::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreCategoryRequest $request
     *
     * @return CategoryResource
     */
    public function store(StoreCategoryRequest $request): CategoryResource
    {
        $model = ResourceCategory::create($request->validated());

        return new CategoryResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ResourceCategory $resource_category
     *
     * @return CategoryResource
     */
    public function show(ResourceCategory $resource_category): CategoryResource
    {
        return new CategoryResource($resource_category);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCategoryRequest $request
     * @param ResourceCategory $resource_category
     *
     * @return CategoryResource
     */
    public function update(UpdateCategoryRequest $request, ResourceCategory $resource_category): CategoryResource
    {
        $model = tap($resource_category)->update($request->validated());

        return new CategoryResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ResourceCategory $resource_category
     *
     * @return Response
     */
    public function destroy(ResourceCategory $resource_category): Response
    {
        $this->authorize('delete', $resource_category);

        $resource_category->delete();

        return response()->noContent();
    }
}
