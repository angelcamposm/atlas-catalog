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
     * @param ResourceCategory $category
     *
     * @return CategoryResource
     */
    public function show(ResourceCategory $category): CategoryResource
    {
        return new CategoryResource($category);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCategoryRequest $request
     * @param ResourceCategory $category
     *
     * @return CategoryResource
     */
    public function update(UpdateCategoryRequest $request, ResourceCategory $category): CategoryResource
    {
        $model = $category->update($request->validated());

        return new CategoryResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ResourceCategory $category
     *
     * @return Response
     */
    public function destroy(ResourceCategory $category): Response
    {
        $category->delete();

        return response()->noContent();
    }
}
