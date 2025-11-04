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
     * @param AuthenticationMethod $authentication_method
     *
     * @return AuthenticationMethodResource
     */
    public function show(AuthenticationMethod $authentication_method): AuthenticationMethodResource
    {
        return new AuthenticationMethodResource($authentication_method);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateAuthenticationMethodRequest $request
     * @param AuthenticationMethod $authentication_method
     *
     * @return AuthenticationMethodResource
     */
    public function update(UpdateAuthenticationMethodRequest $request, AuthenticationMethod $authentication_method): AuthenticationMethodResource
    {
        $model = $authentication_method->update($request->validated());

        return new AuthenticationMethodResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param AuthenticationMethod $authentication_method
     *
     * @return Response
     */
    public function destroy(AuthenticationMethod $authentication_method): Response
    {
        $authentication_method->delete();

        return response()->noContent();
    }
}
