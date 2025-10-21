<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuthenticationMethodRequest;
use App\Http\Requests\UpdateAuthenticationMethodRequest;
use App\Http\Resources\AuthenticationMethodResource;
use App\Http\Resources\AuthenticationMethodResourceCollection;
use App\Models\AuthenticationMethod;
use Illuminate\Http\Response;

class AuthenticationMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return AuthenticationMethodResourceCollection
     */
    public function index(): AuthenticationMethodResourceCollection
    {
        return new AuthenticationMethodResourceCollection(AuthenticationMethod::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreAuthenticationMethodRequest $request
     *
     * @return AuthenticationMethodResource
     */
    public function store(StoreAuthenticationMethodRequest $request): AuthenticationMethodResource
    {
        $model = AuthenticationMethod::create($request->validated());

        return new AuthenticationMethodResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param AuthenticationMethod $authenticationMethod
     *
     * @return AuthenticationMethodResource
     */
    public function show(AuthenticationMethod $authenticationMethod): AuthenticationMethodResource
    {
        return new AuthenticationMethodResource($authenticationMethod);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateAuthenticationMethodRequest $request
     * @param AuthenticationMethod $authenticationMethod
     *
     * @return AuthenticationMethodResource
     */
    public function update(UpdateAuthenticationMethodRequest $request, AuthenticationMethod $authenticationMethod): AuthenticationMethodResource
    {
        $model = $authenticationMethod->update($request->validated());

        return new AuthenticationMethodResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param AuthenticationMethod $authenticationMethod
     *
     * @return Response
     */
    public function destroy(AuthenticationMethod $authenticationMethod): Response
    {
        $authenticationMethod->delete();

        return response()->noContent();
    }
}
