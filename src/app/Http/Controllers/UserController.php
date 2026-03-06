<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
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
     * List all users with optional filtering and pagination.
     *
     * Retrieve a paginated list of system users with their roles and group memberships.
     *
     * **Query Parameters:**
     * - `filter[field]=value` - Filter by field (e.g., ?filter[role]=admin)
     * - `search=term` - Search by email or name
     * - `sort=field` or `sort=-field` - Sort by field (add `-` for descending)
     * - `with=relation1,relation2` - Eager-load (creator, groups, updater)
     * - `per_page=25` - Items per page (default: 15, max: 100)
     *
     * @operationId listUsers
     * @response 200 Successfully retrieved paginated list of users
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Insufficient permissions
     * @param  Request  $request
     * @return UserResourceCollection
     */
    public function index(Request $request): UserResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new UserResourceCollection(
            User::query()
                ->filter($request)
                ->search($request)
                ->sort($request)
                ->with($requestedRelationships)
                ->paginate()
        );
    }

    /**
     * Create a new user.
     *
     * Register a new user account with email and credentials. Users are assigned roles and group memberships
     * after creation via separate endpoints.
     *
     * **Request Body:**
     * - `name` (required, string, 255 chars) - User full name
     * - `email` (required, string, unique) - User email address
     * - `password` (required, string, min 8 chars) - Account password (hashed on server)
     *
     * @operationId createUser
     * @response 201 User created successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Insufficient permissions
     * @response 422 Validation errors (duplicate email, weak password)
     * @param  StoreUserRequest  $request
     * @return UserResource
     */
    public function store(StoreUserRequest $request): UserResource
    {
        $model = User::create($request->validated());

        return new UserResource($model);
    }

    /**
     * Retrieve a specific user by ID or email.
     *
     * Fetch detailed information about a single user, including their role and group memberships.
     *
     * @operationId getUser
     * @response 200 User retrieved successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Cannot view other user details (self only)
     * @response 404 User not found
     * @param  Request  $request
     * @param  User  $user
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
     * Update an existing user.
     *
     * Modify user properties like name or email. Password changes require a separate secure endpoint.
     *
     * @operationId updateUser
     * @response 200 User updated successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Cannot modify other users (self only)
     * @response 404 User not found
     * @response 422 Validation errors (duplicate email)
     * @param  UpdateUserRequest  $request
     * @param  User  $user
     * @return UserResource
     */
    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $user->update($request->validated());

        return new UserResource($user);
    }

    /**
     * Delete a user account.
     *
     * Deactivate or remove a user from the system. Only admins or the user themselves can delete.
     *
     * @operationId deleteUser
     * @response 204 User deleted successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Cannot delete other users
     * @response 404 User not found
     * @param User $user
     * @return Response
     */
    public function destroy(User $user): Response
    {
        $user->delete();

        return response()->noContent();
    }
}
