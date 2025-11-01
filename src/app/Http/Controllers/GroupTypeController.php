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
     * @param GroupType $groupType
     *
     * @return GroupTypeResource
     */
    public function show(GroupType $groupType): GroupTypeResource
    {
        return new GroupTypeResource($groupType);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateGroupTypeRequest $request
     * @param GroupType $groupType
     *
     * @return GroupTypeResource
     */
    public function update(UpdateGroupTypeRequest $request, GroupType $groupType): GroupTypeResource
    {
        $model = $groupType->update($request->validated());

        return new GroupTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GroupType $groupType
     *
     * @return Response
     */
    public function destroy(GroupType $groupType): Response
    {
        $groupType->delete();

        return response()->noContent();
    }
}
