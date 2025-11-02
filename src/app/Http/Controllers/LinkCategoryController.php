<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CategoryResourceCollection;
use App\Models\LinkCategory;
use Illuminate\Http\Response;

class LinkCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return CategoryResourceCollection
     */
    public function index(): CategoryResourceCollection
    {
        return new CategoryResourceCollection(LinkCategory::paginate());
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
        $model = LinkCategory::create($request->validated());

        return new CategoryResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param LinkCategory $linkCategory
     *
     * @return CategoryResource
     */
    public function show(LinkCategory $linkCategory): CategoryResource
    {
        return new CategoryResource($linkCategory);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCategoryRequest $request
     * @param LinkCategory $linkCategory
     *
     * @return CategoryResource
     */
    public function update(UpdateCategoryRequest $request, LinkCategory $linkCategory): CategoryResource
    {
        $model = $linkCategory->update($request->validated());

        return new CategoryResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param LinkCategory $linkCategory
     *
     * @return Response
     */
    public function destroy(LinkCategory $linkCategory): Response
    {
        $linkCategory->delete();

        return response()->noContent();
    }
}
