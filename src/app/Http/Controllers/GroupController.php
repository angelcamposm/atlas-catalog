<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Http\Resources\GroupResource;
use App\Http\Resources\GroupResourceCollection;
use App\Models\Group;
use Illuminate\Http\Response;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return GroupResourceCollection
     */
    public function index(): GroupResourceCollection
    {
        return new GroupResourceCollection(Group::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreGroupRequest $request
     *
     * @return GroupResource
     */
    public function store(StoreGroupRequest $request): GroupResource
    {
        $model = Group::create($request->validated());

        return new GroupResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Group $group
     *
     * @return GroupResource
     */
    public function show(Group $group): GroupResource
    {
        return new GroupResource($group);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateGroupRequest $request
     * @param Group $group
     *
     * @return GroupResource
     */
    public function update(UpdateGroupRequest $request, Group $group): GroupResource
    {
        $model = $group->update($request->validated());

        return new GroupResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Group $group
     *
     * @return Response
     */
    public function destroy(Group $group): Response
    {
        $group->delete();

        return response()->noContent();
    }
}
