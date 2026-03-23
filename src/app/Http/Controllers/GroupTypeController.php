<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupTypeRequest;
use App\Http\Requests\UpdateGroupTypeRequest;
use App\Http\Resources\GroupTypeResource;
use App\Http\Resources\GroupTypeResourceCollection;
use App\Models\GroupType;
use Illuminate\Http\Response;

class GroupTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return GroupTypeResourceCollection
     */
    public function index(): GroupTypeResourceCollection
    {
        return new GroupTypeResourceCollection(GroupType::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreGroupTypeRequest $request
     *
     * @return GroupTypeResource
     */
    public function store(StoreGroupTypeRequest $request): GroupTypeResource
    {
        $model = GroupType::create($request->validated());

        return new GroupTypeResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param GroupType $group_type
     *
     * @return GroupTypeResource
     */
    public function show(GroupType $group_type): GroupTypeResource
    {
        return new GroupTypeResource($group_type);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateGroupTypeRequest $request
     * @param GroupType $group_type
     *
     * @return GroupTypeResource
     */
    public function update(UpdateGroupTypeRequest $request, GroupType $group_type): GroupTypeResource
    {
        $model = tap($group_type)->update($request->validated());

        return new GroupTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GroupType $group_type
     *
     * @return Response
     */
    public function destroy(GroupType $group_type): Response
    {
        $group_type->delete();

        return response()->noContent();
    }
}
