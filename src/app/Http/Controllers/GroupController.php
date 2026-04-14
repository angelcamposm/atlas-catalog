<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Http\Resources\GroupResource;
use App\Http\Resources\GroupResourceCollection;
use App\Models\Group;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GroupController extends Controller
{
    use AllowedRelationships;

    /**
     * List of relationships that can be eagerly loaded with group resources.
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'members',
        'updater',
    ];

    /**
     * Display a listing of the resource.
     *
     * Supports filtering, searching, and sorting via query parameters:
     * - ?filter[field]=value - Filter by field value
     * - ?search=term - Search across searchable fields
     * - ?sort=field or ?sort=-field - Sort ascending or descending
     * - ?with=relation1,relation2 - Eager load relationships
     *
     * @param  Request  $request
     *
     * @return GroupResourceCollection
     */
    public function index(Request $request): GroupResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new GroupResourceCollection(
            Group::query()
                ->filter($request)
                ->search($request)
                ->sort($request)
                ->with($relationships)
                ->paginate()
        );
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
        $model = tap($group)->update($request->validated());

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
        $this->authorize('delete', $group);

        $group->delete();

        return response()->noContent();
    }
}
