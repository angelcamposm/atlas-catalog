<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CategoryResourceCollection;
use App\Models\ApiCategory;
use Illuminate\Http\Response;

class ApiCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return CategoryResourceCollection
     */
    public function index(): CategoryResourceCollection
    {
        return new CategoryResourceCollection(ApiCategory::paginate());
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
        $model = ApiCategory::create($request->validated());

        return new CategoryResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ApiCategory $category
     *
     * @return CategoryResource
     */
    public function show(ApiCategory $category): CategoryResource
    {
        return new CategoryResource($category);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCategoryRequest $request
     * @param ApiCategory $category
     *
     * @return CategoryResource
     */
    public function update(UpdateCategoryRequest $request, ApiCategory $category): CategoryResource
    {
        $model = $category->update($request->validated());

        return new CategoryResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ApiCategory $category
     *
     * @return Response
     */
    public function destroy(ApiCategory $category): Response
    {
        $category->delete();

        return response()->noContent();
    }
}
