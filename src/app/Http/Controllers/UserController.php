<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Http\Resources\UserResourceCollection;
use App\Models\User;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    use AllowedRelationships;

    /**
     * List of allowed relationships that can be eagerly loaded for UserController resources.
     *
     * These relationships can be included in API responses by passing them via the 'with' query parameter.
     * Available relationships:
     * - creator: User who created the UserController
     * - updater: User who last updated the UserController
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'groups',
        'updater',
    ];

    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     *
     * @return UserResourceCollection
     */
    public function index(Request $request): UserResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new UserResourceCollection(User::with($requestedRelationships)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     *
     * @return UserResource
     */
    public function store(Request $request): UserResource
    {
        $model = User::create($request->validated());

        return new UserResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request  $request
     * @param  User  $user
     *
     * @return UserResource
     */
    public function show(Request $request, User $user): UserResource
    {
        if ($request->has('with')) {
            $requestedRelationships = self::filterAllowedRelationships($request->get('with'));
            $user->load($requestedRelationships);
        }

        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param User $user
     *
     * @return UserResource
     */
    public function update(Request $request, User $user): UserResource
    {
        $model = $user->update($request->validated());

        return new UserResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     *
     * @return Response
     */
    public function destroy(User $user): Response
    {
        $user->delete();

        return response()->noContent();
    }
}
