<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupMemberRequest;
use App\Http\Requests\UpdateGroupMemberRequest;
use App\Http\Resources\GroupMemberResource;
use App\Http\Resources\GroupMemberResourceCollection;
use App\Models\GroupMember;
use Illuminate\Http\Response;

class GroupMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return GroupMemberResourceCollection
     */
    public function index(): GroupMemberResourceCollection
    {
        return new GroupMemberResourceCollection(GroupMember::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreGroupMemberRequest $request
     *
     * @return GroupMemberResource
     */
    public function store(StoreGroupMemberRequest $request): GroupMemberResource
    {
        $model = GroupMember::create($request->validated());

        return new GroupMemberResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param GroupMember $groupMember
     *
     * @return GroupMemberResource
     */
    public function show(GroupMember $groupMember): GroupMemberResource
    {
        return new GroupMemberResource($groupMember);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateGroupMemberRequest $request
     * @param GroupMember $groupMember
     *
     * @return GroupMemberResource
     */
    public function update(UpdateGroupMemberRequest $request, GroupMember $groupMember): GroupMemberResource
    {
        $model = $groupMember->update($request->validated());

        return new GroupMemberResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GroupMember $groupMember
     *
     * @return Response
     */
    public function destroy(GroupMember $groupMember): Response
    {
        $groupMember->delete();

        return response()->noContent();
    }
}
