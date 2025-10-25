<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupMemberRoleRequest;
use App\Http\Requests\UpdateGroupMemberRoleRequest;
use App\Http\Resources\GroupMemberRoleResource;
use App\Http\Resources\GroupMemberRoleResourceCollection;
use App\Models\GroupMemberRole;
use Illuminate\Http\Response;

class GroupMemberRoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return GroupMemberRoleResourceCollection
     */
    public function index(): GroupMemberRoleResourceCollection
    {
        return new GroupMemberRoleResourceCollection(GroupMemberRole::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreGroupMemberRoleRequest $request
     *
     * @return GroupMemberRoleResource
     */
    public function store(StoreGroupMemberRoleRequest $request): GroupMemberRoleResource
    {
        $model = GroupMemberRole::create($request->validated());

        return new GroupMemberRoleResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param GroupMemberRole $groupMemberRole
     *
     * @return GroupMemberRoleResource
     */
    public function show(GroupMemberRole $groupMemberRole): GroupMemberRoleResource
    {
        return new GroupMemberRoleResource($groupMemberRole);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateGroupMemberRoleRequest $request
     * @param GroupMemberRole $groupMemberRole
     *
     * @return GroupMemberRoleResource
     */
    public function update(UpdateGroupMemberRoleRequest $request, GroupMemberRole $groupMemberRole): GroupMemberRoleResource
    {
        $model = $groupMemberRole->update($request->validated());

        return new GroupMemberRoleResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GroupMemberRole $groupMemberRole
     *
     * @return Response
     */
    public function destroy(GroupMemberRole $groupMemberRole): Response
    {
        $groupMemberRole->delete();

        return response()->noContent();
    }
}
